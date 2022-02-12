class Input {
	static mousePosition = {x: -1, y: -1};
	
	static initialize()
	{
		document.addEventListener("mousemove", function(e) {
			Input.mousePosition = {x:e.pageX, y:e.pageY};
		});
	}
}

class Time {
	
	static getTime()
	{
		return new Date().getTime();
	}
}

class Math {
	
	static lerp(a, b, t)
	{
		return (1 - t) * a + t * b;
	}
}

class Behaviour {
	
	update(func)
	{
		const targetFPS = 60;
		
		var _dTime = Time.getTime();
		return setInterval(function() {
			var deltaTime = (Time.getTime() - _dTime) / 1000;
			_dTime = Time.getTime();
			
			func(deltaTime);
		}, 1000 / targetFPS);
	}
	
	setPosition(el, x, y) {
		el.style.left = x + 'px';
		el.style.top = y + 'px';
		el.style.transform = "translate(-50%, -50%)";
	}
}

class Toast extends Behaviour {
	static style = "padding: 5px 10px; position: absolute; z-index: 9999; background-color: rgba(45, 45, 45, 0.7); color: white; border-radius: 7px;";
	
	//id: string
	//text: string
	constructor(id, text)
	{
		super();
		this.id = id;
		this.text = text;
		this.position = null;
	}
	
	//offsetX: number
	//offsetY: number
	setOffset(offsetX, offsetY)
	{
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	}
	
	//x: number
	//y: number
	setStartPosition(x, y)
	{
		this.startPosition = {x:x, y:y};
	}
	
	//fixed: boolean
	setFixed(fixed)
	{
		this.fixed = fixed;
	}
	
	//delay: number
	//duration: number
	setDelay(delay, duration)
	{
		this.delay = delay;
		this.duration = duration;
	}
	
	show()
	{
		var el = document.createElement("div");
		el.id = this.id;
		el.innerText = this.text;
		el.style = Toast.style;
		document.body.appendChild(el);
		
		if(!this.fixed)
			document.addEventListener('mousemove', (e) => this.setPosition(el, e.pageX + this.offsetX, e.pageY + this.offsetY));
		
		if(this.startPosition == null)
			this.setPosition(el, Input.mousePosition.x + this.offsetX, Input.mousePosition.y + this.offsetY);
		else
			this.setPosition(el, this.startPosition.x + this.offsetX, this.startPosition.y + this.offsetY);
		
		if(this.delay == -1)
			return;
		
		var delayElapsed = 0;
		var elapsed = 0;
		var delay = this.delay;
		var duration = this.duration;
		var update = this.update(function(deltaTime) {
			if(delayElapsed < delay)
			{
				delayElapsed += deltaTime;
				return;
			}
			
			el.style.opacity = Math.lerp(1, 0, elapsed / duration);
			
			elapsed += deltaTime;
			if(elapsed >= duration)
			{
				el.parentNode.removeChild(el);
				clearInterval(update);
			}
		});
	}
}
