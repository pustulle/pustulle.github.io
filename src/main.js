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
	this.ghost_player.start(true, 80, 50)
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
	this.side=[w-100,100]
	this.anchor.y=1
	this.number_side=1
	this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	//this.flag_repulse ={true,true}
	this.flag_repulse_right=true
	this.flag_repulse_left=true
	this.flag_effect=true
	this.flag_random_effect=true
	this.flag_enerve=true
	this.flag_update=true
	this.flag_restart=false
	this.flag_move=true
	this.time_repulse=60
	this.time_move_to_center=800
	this.time_move_to_an_opposite_direction=3000
	this.count_for_die=3
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
this.filter=game.add.sprite(0,0,'filter')
	this.filter.alpha=.5
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

//si 0 processus normal si 1 random side
character.prototype.move = function(side) {
	if(this.flag_move){
		this.flag_move=false
		if(side==0){
			this.time_move=game.rnd.integerInRange(500,2000)
			console.log(this.time_move,"tm");
			this.calculate_side()
			this.tween_characteristic = game.add.tween(this).to({x:this.sidex,y:h2+25},this.time_move,Phaser.Easing.Linear.None,true,0)
			this.tween_characteristic.onComplete.add(function(){this.flag_move=true},this)
			this.tween_characteristic.onComplete.add(() => this.move(0),this)

		}else{
			var chosen_value = Math.random() < 0.5 ? 0 : w;
			this.tween_characteristic=game.add.tween(this).to({x:chosen_value},this.time_move_to_an_opposite_direction,Phaser.Easing.Linear.None,true,0)
			game.time.events.add(20,this.reset_flag_random_effect,this )
			game.time.events.add(20,function(){this.flag_move=true},this)

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
	if(this.flag_random_effect){

		this.flag_random_effect=false
		this.flag_repulse_right && this.show_little_effect_left()
	}else{
		if(this.flag_repulse_right){
			this.show_effect_left()
			if (this.x > this.button1.x && this.x < 500) {
				this.flag_repulse_right=false
				this.stop_move()	
				this.tween_repulse_to_right = game.add.tween(this).to({x:800,y:h2+25},this.time_repulse,Phaser.Easing.Linear.None,true,0)
				this.tween_repulse_to_right.onComplete.add(this.reset_flag_repulse_right,this)
			}
		}
	}
}
character.prototype.repulse_to_left = function() {
	if(this.flag_random_effect){
		this.flag_random_effect=false
		this.flag_repulse_left && this.show_little_effect_right()

	}else{
		if(this.flag_repulse_left){
			this.show_effect_right()
			if (this.x < this.button2.x && this.x > w-500) {
				this.flag_repulse_left=false
				this.stop_move()	
				this.tween_repulse_to_left = game.add.tween(this).to({x:w-800,y:h2+25},this.time_repulse,Phaser.Easing.Linear.None,true,0)
				this.tween_repulse_to_left.onComplete.add(this.reset_flag_repulse_left,this)
			}
		}
	}
}

character.prototype.show_effect_right = function() {

	if (this.flag_effect){
		this.flag_effect=false
		this.tween_effect2=game.add.tween(this.button2.effect).to({alpha:.5},this.time_repulse,Phaser.Easing.Bounce.Out,true,0)
		this.tween_effect2.yoyo(this.time_repulse,true)
		this.tween_effect2.onComplete.add(this.reset_flag_effect,this)
	}
}
character.prototype.show_effect_left = function() {
	if (this.flag_effect){
		this.flag_effect=false
		this.tween_effect1=game.add.tween(this.button1.effect).to({alpha:.5},this.time_repulse,Phaser.Easing.Bounce.Out,true,0)
		this.tween_effect1.yoyo(this.time_repulse,true)
		this.tween_effect1.onComplete.add(this.reset_flag_effect,this)
	}
}

character.prototype.show_little_effect_right = function() {
	if (this.flag_effect){
		this.flag_effect=false

		this.tween_effect3=game.add.tween(this.button2.effect).to({alpha:.1},this.time_repulse,Phaser.Easing.Bounce.Out,true,0)
		this.tween_effect3.yoyo(this.time_repulse,true)
		this.tween_effect3.onComplete.add(this.reset_flag_effect,this)
		this.tween_effect3.onComplete.add(this.reset_flag_repulse_right,this)

	}
}
character.prototype.show_little_effect_left = function() {
	if (this.flag_effect){
		this.flag_effect=false

		this.tween_effect4=game.add.tween(this.button1.effect).to({alpha:.1},this.time_repulse,Phaser.Easing.Bounce.Out,true,0)
		this.tween_effect4.yoyo(this.time_repulse,true)
		this.tween_effect4.onComplete.add(this.reset_flag_effect,this)
		this.tween_effect4.onComplete.add(this.reset_flag_repulse_left,this)
}
}
character.prototype.reset_flag_random_effect = function() {
	this.flag_random_effect=true	
}

character.prototype.random_effect=function(){
if(this.flag_move){
	this.random_effect_generate=game.rnd.integerInRange(0,10)
	console.log(this.random_effect_generate,"random_effect_generate");
	switch(this.random_effect_generate){
		case 0:
			console.log(0);
			console.log("jump_enerve");
			this.jump_enerve()
			break

			break
		case 1:
			console.log("jump_enerve");
			this.jump_enerve()
			break
		case 2:
			console.log("enerve");
			this.move_to_center(this.enerve)
			break
		default:
			console.log("move");
			this.move(0)
			//break
			//this.move();
	}
}
}
character.prototype.move_to_center = function(next_function){
	this.tween_move_to_center=game.add.tween(this).to({x:w2,y:h2+25},this.time_move_to_center,Phaser.Easing.Linear.None,true,0)
	this.tween_move_to_center.onComplete.add(next_function,this)
}

//TODO indispensable car si le joeur reste au milieu....
character.prototype.wake_up = function() {
	//si temps inactivité this.move et animation de réveil	
	//car c'est seulement button qui redémarre le joeur
}

//enerve est le seul qui dispose de son drapeau car on doit permettre son action pendant le jeu
character.prototype.jump_enerve = function() {
	if(this.flag_enerve){
		this.flag_enerve=false
		this.tween_enerve = game.add.tween(this).to({y:this.y-300},500,Phaser.Easing.Bounce.In,true,0)
		this.tween_enerve.yoyo(500,true)
		game.time.events.add( 1000,this.reset_flag_enerve,this )
	}
}

character.prototype.reset_flag_enerve = function() {
	console.log('reset')
	this.y=0
	this.flag_enerve=true	
}
//TODO flag_update et flag_random_effect voir lequel mettre et simplifier
//mouvements speciaux
character.prototype.enerve = function() {
	//this.flag_random_effect=true	
	console.log("il est énervé");
	this.tween_enerve0=game.add.tween(this.scale).to({x:1.5,y:1},2000,Phaser.Easing.Linear.None,true)
	this.tween_enerve1=game.add.tween(this).to({y:100},2000,Phaser.Easing.Linear.None,true)
	this.tween_enerve1.onComplete.add(function(){this.flag_move=true})
	this.tween_enerve1.onComplete.add(() => this.move(1),this)
	//this.tween_enerve0.chain(this.tween_enerve1)	
	//this.tween_enerve0.start()
	//onComplete > this.flag_random_effect=false
}

character.prototype.reset_flag_effect = function() {
	this.flag_effect=true
}

character.prototype.reset_flag_repulse_right = function() {
	this.reset_aspect()
	this.flag_repulse_right=true
}
character.prototype.reset_flag_repulse_left = function() {
	this.reset_aspect()
	this.flag_repulse_left=true
}

character.prototype.reset_aspect=function(){
	console.log("reset_aspect");
	this.scale.setTo(1,1)
	this.alpha=1
	this.random_effect()
}


character.prototype.stop_move = function() {
	this.tween_characteristic.stop()	
	this.flag_move=true
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

	if (this.flag_update){
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
			this.ghost_player.on=true
		}else{
			this.die()
		}

	if (this.flag_random_effect){
		if (this.x >= 500+1 && this.x <= w-501){
			this.scale.y=1
			this.scale.x=1
		}else {
			this.scale.y=.9
			this.scale.x=1.2
		}
	}
}
character.prototype.die = function() {
	this.count_for_die--
	if (this.count_for_die>=1){
		this.life.text=this.count_for_die
		this.visible=false	
		this.particle = game.add.emitter(this.x, this.y-50, 200)
		this.particle.makeParticles("rect")
		this.particle.minParticleSpeed.setTo(-600,-600)
		this.particle.maxParticleSpeed.setTo(800,800)
		this.particle.setAlpha(.5, .8)
		this.particle.minParticleScale = .5
		this.particle.maxParticleScale = .5
		this.particle.minRotation = 0
		this.particle.maxRotation = 0
		this.particle.on=false
		this.particle.start(true, 500,null,20)
		this.ghost_player.visible=false
		this.stop_move()
		this.x=w2	
		this.alpha=.2
		game.time.events.add( 500,this.revive,this )
		console.log('game_over')
	}else{
		this.game_over.visible=true
		this.visible=false
		this.stop_move()
		this.flag_repulse=false
		this.flag_effect=false
		this.flag_enerve=false
		this.flag_update=false
		this.anim_score()
		this.life.visible=false
	}	
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
		console.log('restart')	
		game.state.start('boot',bootstate)
	}
}

character.prototype.revive = function() {
	this.alpha=1	
	this.move(0)
}

character.prototype.hide_particle = function() {
	this.particle.visible=false	
}

var bootstate= {
	preload: function(){
		console.log("%cStarting PaperMania game", "color:white; background:red");
		//this.stage.backgroundColor = "#3b2c27"
		this.load.image('particle_player','assets/particle_player.png')
		this.load.image('studio','assets/studio.png')
		this.load.image("loading","assets/loading.png"); 
	},
	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
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
		var border_progress_bar= this.add.sprite(w2,1078,'border_progress_bar')
		border_progress_bar.anchor.x=.5
		var loadingBar = this.add.sprite(w2,h2,"loading");
		loadingBar.anchor.setTo(0.5,0.5);
		this.load.setPreloadSprite(loadingBar);
		//spritesheet
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
	},
}

game = new Phaser.Game(1280,h,Phaser.CANVAS,'' )
game.state.add('boot',bootstate)
game.state.add('preload',preloadstate)
game.state.add('game_first_screen',game_first_screen)
game.state.add('game_state',game_state)
game.state.start('boot',bootstate)
