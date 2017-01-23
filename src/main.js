var ratio_device=window.screen.height/window.screen.width
var h=1280*ratio_device
var w=1280
var h2=h*.5
var w2=w*.5

opponent = function(){
	Phaser.Sprite.call(this,game,-100,550,"button")
	this.flag_drag=true
	this.anchor.setTo(.5,.5)
	this.visible=true
	this.pos=0
} 

opponent.prototype = Object.create(Phaser.Sprite.prototype)
opponent.prototype.constructor = opponent

opponent.prototype.button_move = function(xpos) {
	console.log('move')
	game.add.tween(this).to({x:xpos},300,Phaser.Easing.Linear.None,true,0)
	this.tween_button_move = game.add.tween(this).to({y:400},150,Phaser.Easing.Linear.None,true,0)
	this.tween_button_move.yoyo(150,true)
	this.tween_button_move.onComplete.add(this.reset_y,this)
}
opponent.prototype.reset_y = function() {
	this.pos=this.pos+200
	this.button_move(this.pos)
}

first = function(){
	Phaser.Sprite.call(this,game,0,255,'rect')
	this.flag_drag=true
	this.flag_drag && this.allow_drag(this)
	this.anchor.setTo(.5,.5)
	this.visible=true
	this.ghost_player = game.add.emitter(this.x, this.y-50, 200)
	this.ghost_player.makeParticles("rect")
	this.ghost_player.minParticleSpeed.setTo(-0,-0)
	this.ghost_player.maxParticleSpeed.setTo(0,0)
	this.ghost_player.setAlpha(.1, .2)
	this.ghost_player.minParticleScale = 1
	this.ghost_player.maxParticleScale = 1
	this.ghost_player.minRotation = 0
	this.ghost_player.maxRotation = 0
	this.ghost_player.on=true
	this.ghost_player.start(true,8000, 200)
	this.fall_jump()
	this.title_game = game.add.bitmapText(w2,200,"lucky",'RETROSCAPE',50)
	this.title_game.flag_drag=true
	this.title_game.flag_drag && this.allow_drag(this.title_game)
	this.title_game.anchor.setTo(.5,.5)
	this.title_game.alpha=0	
	game.time.events.add(4000,this.appears_title_game,this)
} 

first.prototype = Object.create(Phaser.Sprite.prototype)
first.prototype.constructor = first

first.prototype.appears_title_game = function() {
	this.tween_appears = game.add.tween(this.title_game).to({alpha:1},800,Phaser.Easing.Linear.None,true,0)
	this.tween_scale = game.add.tween(this.title_game.scale).to({x:2,y:2},800,Phaser.Easing.Linear.None,true,0)
}

first.prototype.allow_drag = function(obj) {
	obj.inputEnabled=true	
	obj.input.enableDrag(true)
}

first.prototype.fall_jump = function() {
	this.tween_characteristic = game.add.tween(this).to({y:600},400,Phaser.Easing.Bounce.In,true,0)
	this.tween_characteristic2 = game.add.tween(this).to({x:200},400,Phaser.Easing.Linear.None,true,0)
	this.tween_characteristic2.onComplete.add(this.jump,this)
}

first.prototype.jump = function() {
	this.tween_jump = game.add.tween(this).to({y:500},400,Phaser.Easing.Bounce.In,true,0)
	this.tween_jump.yoyo(400,true)
	this.tween_jump.onComplete.add(this.move,this)
}
first.prototype.move = function() {
	this.tween_move = game.add.tween(this).to({x:2000},700,Phaser.Easing.Linear.None,true,0)
}

first.prototype.update = function() {
	this.ghost_player.y=this.y
	this.ghost_player.x=this.x
}

character = function(){
	Phaser.Sprite.call(this,game,w2,h2+25,'rect_l')
	this.tint=0x030000
	this.side=[w-100,100]
	this.anchor.y=1
	this.anchor.x=.5
	this.number_side=1
	this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.flag_repulse_right=true
	this.flag_repulse_left=true
	this.flag_effect=true
	this.tween_exist=false
	this.tween_move_1_exist=false
	this.flag_enerve=true
	this.flag_on_life=true
	this.flag_cant_moving=true
	this.time_repulse=40
	this.time_move_to_center=400
	this.time_move_to_an_opposite_direction=600
	this.time_enerve=400
	this.count_for_die=3
	//TODO
	game.time.events.add( 1000,() => this.move(0),this )
	this.button1=game.add.button(100,h2,'button',this.repulse_to_right,this)
	this.button1.anchor.setTo(.5,.5)
	this.button1.effect=game.add.sprite(0,0,'effect')
	this.button1.effect.alpha=0
	this.button2=game.add.button(w-100,h2,'button',this.repulse_to_left,this)
	this.button2.anchor.setTo(.5,.5)
	this.button2.effect=game.add.sprite(w,0,'effect')
	this.button2.effect.alpha=0
	this.button2.effect.scale.x=-1

	this.button3=game.add.button(w2,660,'button',this.restart,this)
	this.button3.anchor.setTo(.5,.5)
	this.button3.alpha=0

	this.random_list=[1,2,3,4,5,6]
	this.ghost_player = game.add.emitter(this.x, this.y-25, 200)
	this.ghost_player.makeParticles("rect_l")
	this.ghost_player.minParticleSpeed.setTo(-0,-0)
	this.ghost_player.maxParticleSpeed.setTo(0,0)
	this.ghost_player.setAlpha(.1, .2)
	this.ghost_player.minParticleScale = 1
	this.ghost_player.maxParticleScale = 1
	this.ghost_player.minRotation = 0
	this.ghost_player.maxRotation = 0
	this.ghost_player.on=true
	this.ghost_player.start(true, 80, 50)

	this.score = game.add.bitmapText(w2,h-200,'lucky',"400",60)
	this.number=10
	this.score.text=this.number
	this.score.anchor.setTo(.5,.5)

	this.life=game.add.bitmapText(w2,h-100,'lucky',"3",30)
	this.game_over=game.add.bitmapText(w2,h2,'lucky_red',"game over",100)
	this.game_over.anchor.setTo(.5,.5)
	this.game_over.visible=false
	this.life.anchor.setTo(.5,.5)
} 

character.prototype = Object.create(Phaser.Sprite.prototype)
character.prototype.constructor = character

//TODO indispensable car si le joeur reste au milieu....
character.prototype.wake_up = function() {
	//si temps inactivité this.move et animation de réveil	
	//car c'est seulement button qui redémarre le joeur
}
//enerve est le seul qui dispose de son drapeau car on doit permettre son action pendant le jeu
character.prototype.jump_enerve = function() {
	if(this.flag_enerve){
		this.flag_enerve=false
		this.tween_jump_enerve = game.add.tween(this).to({y:this.y-300},300,Phaser.Easing.Bounce.In,true,0)
		this.tween_jump_enerve1=game.add.tween(this.scale).to({y:2},300,Phaser.Easing.Bounce.In,true,0)
		this.tween_jump_enerve.yoyo(300,true)
		this.tween_jump_enerve1.yoyo(300,true)
		game.time.events.add( 600,this.flag_enerve_on,this )
	}
}

//mouvements speciaux
character.prototype.enerve = function() {
	console.log("il est énervé");
	this.ghost_player.on=false
	this.tween_enerve0=game.add.tween(this).to({x:this.x+5},40,Phaser.Easing.Linear.None,true,0,10)
	this.tween_enerve0.yoyo(50,true)
	this.tween_enerve1=game.add.tween(this.scale).to({x:2,y:.3},550,Phaser.Easing.Linear.None,true,0)
	this.tween_enerve2=game.add.tween(this.scale).to({x:1.2,y:1.2},550,Phaser.Easing.Elastic.Out,true,550)
	this.tween_enerve3=game.add.tween(this).to({y:-200},750,Phaser.Easing.Quartic.In,true,150)
	this.tween_enerve4=game.add.tween(this).to({y:420},4050,Phaser.Easing.Linear.None)
	this.tween_enerve3bis=game.add.tween(this.scale).to({x:1,y:1.4},250,Phaser.Easing.Elastic.Out,true,550)
	this.tween_enerve4bis=game.add.tween(this.scale).to({x:1.6,y:.8},150,Phaser.Easing.Elastic.Out,true,950)
	this.tween_enerve3.chain(this.tween_enerve4)
	this.tween_enerve4.onComplete.add(() => this.move(1),this)
}

character.prototype.scale_x = function() {
	console.log("scale_x");
	this.ghost_player.on=false
	this.tween_scale_x0=game.add.tween(this.scale).to({x:10,y:.3},850,Phaser.Easing.Linear.None,true,0)
	this.tween_scale_x0.onComplete.add(() => this.move(1),this)
}

character.prototype.scale_y = function() {
	console.log("scale_y");
	this.ghost_player.on=false
	this.tween_scale_y0=game.add.tween(this.scale).to({y:10},850,Phaser.Easing.Elastic.InOut,true,0)
	this.tween_scale_y0.onComplete.add(() => this.move(1),this)
}
//si 0 processus normal si 1 random side
character.prototype.move = function(side) {
	console.log("try_to_move");
	if(this.tween_exist==false){
		this.tween_exist=true
		if(side==0 && this.flag_cant_moving){
			console.log('move0')
			this.time_move=game.rnd.integerInRange(500,2000)
			this.calculate_side()
			this.tween_characteristic = game.add.tween(this).to({x:this.sidex,y:h2+25},this.time_move,Phaser.Easing.Linear.None,true,0)

			this.tween_characteristic.onComplete.add(function(){this.tween_exist=false ; console.log('msg') ; this.move(0)},this)
		}else if(side==1 && this.flag_cant_moving==false) {
			this.tween_move_1_exist=true
			console.log('move1')
			var chosen_value = Math.random() < 0.5 ? 0 : w;
			this.flag_cant_moving_on()
			this.tween_characteristic=game.add.tween(this).to({x:chosen_value},this.time_move_to_an_opposite_direction,Phaser.Easing.Linear.None,true,0)
			this.tween_exist=true
		}
	}
}

character.prototype.calculate_side = function() {
	this.random=game.rnd.integerInRange(0,5)
	if (this.random < 4){
		this.sidex=1000*(Math.random(0,w))
	}else{
		this.sidex=Math.random() < 0.5 ? 0 : w	}
}

character.prototype.repulse_to_right = function() {
	if(this.flag_on_life){
		if(this.flag_cant_moving==false){
			console.log('little_effect')
			this.flag_repulse_right && this.show_little_effect_left()
		}else if(this.flag_cant_moving==true){
			if(this.flag_repulse_right){
				this.show_effect_left()
				if (this.x > this.button1.x && this.x < 500) {
					console.log('repulse_to_right')
					this.flag_repulse_right=false
					this.tween_exist && this.stop_move()	
					this.tween_repulse_to_right = game.add.tween(this).to({x:800,y:h2+25},this.time_repulse,Phaser.Easing.Linear.None,true,0)
					this.tween_repulse_to_right1 = game.add.tween(this.scale).to({x:2.5},this.time_repulse,Phaser.Easing.Linear.None,true,0)
					this.tween_repulse_to_right.onComplete.add(this.flag_repulse_right_on,this)
				}
			}
		}
	}
}

character.prototype.repulse_to_left = function() {
	if(this.flag_on_life){
		if(this.flag_cant_moving==false){
			console.log('little_effect_left')
			this.flag_repulse_left && this.show_little_effect_right()

		}else if(this.flag_cant_moving==true){
			if(this.flag_repulse_left){
				this.show_effect_right()
				if (this.x < this.button2.x && this.x > w-500) {
					console.log('repulse_to_left')
					this.flag_repulse_left=false
					this.tween_exist && this.stop_move()	
					this.tween_repulse_to_left = game.add.tween(this).to({x:w-800,y:h2+25},this.time_repulse,Phaser.Easing.Linear.None,true,0)
					this.tween_repulse_to_left1 = game.add.tween(this.scale).to({x:2.5},this.time_repulse,Phaser.Easing.Linear.None,true,0)
					this.tween_repulse_to_left.onComplete.add(this.flag_repulse_left_on,this)
				}
			}
		}
	}
}

character.prototype.show_effect_right = function() {
	if (this.flag_effect){
		this.flag_effect=false
		this.tween_effect2=game.add.tween(this.button2.effect).to({alpha:.5},this.time_repulse,Phaser.Easing.Bounce.Out,true,0)
		this.tween_effect2.yoyo(this.time_repulse,true)
		this.tween_effect2.onComplete.add(this.flag_effect_on,this)
	}
}

character.prototype.show_effect_left = function() {
	if (this.flag_effect){
		this.flag_effect=false
		this.tween_effect1=game.add.tween(this.button1.effect).to({alpha:.5},this.time_repulse,Phaser.Easing.Bounce.Out,true,0)
		this.tween_effect1.yoyo(this.time_repulse,true)
		this.tween_effect1.onComplete.add(this.flag_effect_on,this)
	}
}

character.prototype.show_little_effect_right = function() {
	if (this.flag_effect){
		this.flag_effect=false
		this.tween_effect3=game.add.tween(this.button2.effect).to({alpha:.1},this.time_repulse,Phaser.Easing.Bounce.Out,true,0)
		this.tween_effect3.yoyo(this.time_repulse,true)
		this.tween_effect3.onComplete.add(this.flag_effect_on,this)
		this.tween_effect3.onComplete.add(this.flag_repulse_right_on,this)
	}
}

character.prototype.show_little_effect_left = function() {
	if (this.flag_effect){
		this.flag_effect=false
		this.tween_effect4=game.add.tween(this.button1.effect).to({alpha:.1},this.time_repulse,Phaser.Easing.Bounce.Out,true,0)
		this.tween_effect4.yoyo(this.time_repulse,true)
		this.tween_effect4.onComplete.add(this.flag_effect_on,this)
		this.tween_effect4.onComplete.add(this.flag_repulse_left_on,this)
	}
}

character.prototype.random_effect=function(){
	if(this.flag_cant_moving && this.tween_move_1_exist==false){
		console.log('activate')
		this.random_effect_generate=game.rnd.integerInRange(0,4)
		console.log(this.random_effect_generate);
		switch(this.random_effect_generate){
			case 0:
				this.move(0)
				this.jump_enerve()
				break
			case 1:
				this.flag_cant_moving=false
				this.move_to_center(this.scale_x)
				break
			case 2:
				this.flag_cant_moving=false
				this.move_to_center(this.enerve)
				break
			case 3:
				this.flag_cant_moving=false
				this.move_to_center(this.scale_y)
				break
			default:
				this.move(0)
		}
	}
}

character.prototype.move_to_center = function(next_function){
	this.tween_move_to_center=game.add.tween(this).to({x:w2,y:h2+25},this.time_move_to_center,Phaser.Easing.Linear.None,true,0)
	this.tween_move_to_center.onComplete.add(next_function,this)
}

character.prototype.reset_flag_random_effect = function() {
	console.log('reset_flag_random_effect')
	this.flag_random_effect=true	
}

character.prototype.flag_effect_on = function() {
	this.flag_effect=true
}

character.prototype.flag_repulse_right_on = function() {
	this.flag_cant_moving && this.reset_aspect()
	this.flag_repulse_right=true
}

character.prototype.flag_repulse_left_on = function() {
	this.flag_cant_moving && this.reset_aspect()
	this.flag_repulse_left=true
}

character.prototype.reset_aspect_for_revive = function() {
	this.tween_reset_aspect=game.add.tween(this.scale).to({x:1,y:1},800,Phaser.Easing.Elastic.Out,true,0)
	this.alpha=1
}


character.prototype.reset_aspect=function(){
	this.tween_reset_aspect=game.add.tween(this.scale).to({x:1,y:1},800,Phaser.Easing.Elastic.Out,true,0)
	this.alpha=1
	this.random_effect()
}

character.prototype.flag_enerve_on = function() {
	this.y=0
	this.flag_enerve=true	
}

character.prototype.stop_move = function() {
	console.log('stop')
	this.tween_characteristic.stop()	
	this.tween_exist=false
	this.tween_move_1_exist=false
	this.tween_characteristic_on=false
}

character.prototype.update=function(){
	this.ghost_player.y=this.y-25
	this.ghost_player.x=this.x
	//in case keyboard
	if (this.rightKey.isDown){
		this.repulse_to_left() 
	}
	if (this.leftKey.isDown){
		this.repulse_to_right() 
	}
	if (this.flag_on_life){
		if (this.x > w-300 && this.x < this.button2.x){
			this.number++
			this.score.text=this.number
		}
		if (this.x > this.button1.x && this.x < 300){
			this.number++
			this.score.text=this.number
		}
	}

	if (this.x >= 100+1 && this.x <= w-101){
		this.visible=true
	}else{
		this.die()
	}

	if (this.flag_cant_moving){
		if (this.x >= 500+1 && this.x <= w-501){
			//this.scale.y=1
			//this.scale.x=1
		}else {
			//this.scale.y=.9
			//this.scale.x=1.2
		}
	}
}

character.prototype.die = function() {
	if(this.flag_on_life){
		this.flag_on_life_off()
		this.flag_cant_moving_off()
		console.log('lifeenmoins')
		this.count_for_die--
		if (this.count_for_die>=1){
			this.life.text=this.count_for_die
			this.explode()
			this.visible=false	
			this.tween_exist && this.stop_move()
			this.x=w2	
			this.alpha=.1
			game.time.events.add( 100,this.revive,this )
		}else{
			console.log('game_over')
			this.game_over.visible=true
			this.visible=false
			this.tween_exist && this.stop_move()
			this.flag_repulse=false
			this.flag_effect=false
			this.flag_enerve=false
			this.flag_update=false
			this.anim_score()
			this.life.visible=false
		}	
	}
}

character.prototype.explode=function(){
	this.particle = game.add.emitter(this.x, this.y-28, 200)
	this.particle.makeParticles("rect")
	this.particle.minParticleSpeed.setTo(-600,-600)
	this.particle.maxParticleSpeed.setTo(800,800)
	this.particle.setAlpha(.2, .6)
	this.particle.minParticleScale = .5
	this.particle.maxParticleScale = .5
	this.particle.minRotation = 0
	this.particle.maxRotation = 0
	this.particle.on=false
	this.particle.start(true, 500,null,20)
	this.ghost_player.visible=false
}

character.prototype.anim_score = function() {
	this.tween_score = game.add.tween(this.score.scale).to({x:2,y:2},800,Phaser.Easing.Linear.None,true,0)
	this.tween_score.onComplete.add(this.replay,this)	
}

character.prototype.replay = function() {
	this.score.text="replay"	
	this.flag_restart=true
}

character.prototype.restart = function() {
	if(this.flag_restart){
		this.flag_restart=false
		game.state.start('boot',bootstate)
	}
}

character.prototype.revive = function() {
	console.log("revive");
	this.tween_revive = game.add.tween(this).to({alpha:1},900,Phaser.Easing.Bounce.Out,true,0)
	this.tween_revive.onComplete.add(this.flag_on_life_on,this)
	this.tween_revive.onComplete.add(this.flag_cant_moving_on,this)
	this.tween_revive.onComplete.add(this.reset_aspect_for_revive,this)
	this.tween_revive.onComplete.add(function(){this.tween_exist=false})
	this.tween_revive.onComplete.add(() => this.move(0),this)
}

character.prototype.hide_particle = function() {
	this.particle.visible=false	
}

character.prototype.flag_cant_moving_on = function() {
	this.flag_cant_moving=true	
}

character.prototype.flag_cant_moving_off = function() {
	this.flag_cant_moving=false	
}

character.prototype.flag_on_life_on = function() {
	this.flag_on_life=true	
}

character.prototype.flag_on_life_off = function() {
	this.flag_on_life=false	
}

var bootstate= {
	preload: function(){
		console.log("%cStarting PaperMania game", "color:white; background:red");
		this.stage.backgroundColor = "#FFFFFF"
		this.load.image('particle_player','assets/particle_player.png')
		this.load.image('studio','assets/studio.png')
		this.load.image("loading","assets/loading.png"); 
	},
	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
		//this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
		this.scale.pageAlignHorizontally = true
		this.scale.pageAlignVertically = true
		this.scale.refresh()
		this.state.start("preload");
	}
}

var preloadstate = {
	preload: function(){ 
		//loadingBar
		var studio= this.add.sprite(w2,880,'studio')
		var loadingBar = this.add.sprite(w2,h2,"loading");
		loadingBar.anchor.setTo(0.5,0.5);
		this.load.setPreloadSprite(loadingBar);
		//images
		this.game.load.image("filter","assets/filter.png");
		this.game.load.image("effect","assets/effect.png");
		this.game.load.image("rect_l","assets/rect_l.png");
		this.game.load.image("rect","assets/rect.png");
		this.game.load.image("button","assets/button.png");
		this.game.load.image("background","assets/background.png");
		//font bitmapFont
		this.game.load.bitmapFont('lucky_red','fonts/font_red.png', 'fonts/font_red.fnt');
		this.game.load.bitmapFont('lucky','fonts/font.png', 'fonts/font.fnt');
	},
	create: function(){
		//this.game.state.start("game_first_screen");
		this.game.state.start("game_state");
	}
}

var game_first_screen = {
	create: function(){
		game.add.sprite(0,0,'background')
		this.begin= new first() 
		game.add.existing(this.begin)
		this.begin.alpha=.8
		this.opponent1=new opponent()
		game.add.existing(this.opponent1)
		game.time.events.add( 1500,() => this.opponent1.button_move(0),this.opponent1 )
		this.opponent2=new opponent()
		game.add.existing(this.opponent2)
		game.time.events.add( 2000,() => this.opponent2.button_move(0),this.opponent2 )
		game.time.events.add( 8000,() => game.state.start('game_state',game_state))
	},
}

var game_state = {
	create: function(){
		game.add.sprite(0,0,'background')
		this.game= new character() 
		game.add.existing(this.game)
		this.game.alpha=.8
		this.filter=game.add.sprite(0,0,'filter')
		this.filter.alpha=.0
	},
}

//game = new Phaser.Game(1280,1920,Phaser.CANVAS,'' )
game = new Phaser.Game(1280,h,Phaser.CANVAS,'' )
game.state.add('boot',bootstate)
game.state.add('preload',preloadstate)
game.state.add('game_first_screen',game_first_screen)
game.state.add('game_state',game_state)
game.state.start('boot',bootstate)
