/**
 * ============================================================================
 * 🖤 PROPUESTA MÁGICA: ¿QUIERES SER MI NOVIA? (JUKARY & ANTONIO)
 * ============================================================================
 */

class EscenaIntro extends Phaser.Scene {
    constructor() { super('EscenaIntro'); }
    preload() {
        // Carga de recursos de la introducción
        this.load.image('fondo_menu', 'img/fondo_oscuro.jpg');
        this.load.image('chispa', 'https://labs.phaser.io/assets/particles/yellow.png');
        this.load.audio('sonido_escribir', 'music/escribir.mp3'); 
        this.load.audio('clic', 'music/clic.mp3'); 
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }
    create() {
        this.sound.pauseOnBlur = false;
        const midX = this.cameras.main.centerX;
        const midY = this.cameras.main.centerY;
        
        this.add.image(midX, midY, 'fondo_menu').setDisplaySize(this.cameras.main.width, this.cameras.main.height).setAlpha(0.3);
        this.sndEscribir = this.sound.add('sonido_escribir', { loop: true, volume: 0.5 });
        this.sndClic = this.sound.add('clic', { volume: 0.5 });
        
        // Carga de fuentes estéticas de Google
        WebFont.load({
            google: { families: ['Cinzel Decorative', 'Eagle Lake'] },
            active: () => { this.prepararSobre(midX, midY); }
        });
    }
    prepararSobre(midX, midY) {
        const cSobre = 0x1a1a1a; // Estética oscura
        this.sobreContainer = this.add.container(midX, midY);
        this.trasera = this.add.rectangle(0, 0, 420, 280, cSobre).setStrokeStyle(4, 0xd4af37);
        this.textoAd = this.add.text(0, 0, 'SÓLO PARA TUS OJOS\n🖤', { fontSize: '22px', fill: '#d4af37', align: 'center', fontFamily: 'Cinzel Decorative' }).setOrigin(0.5);
        this.frontal = this.add.rectangle(0, 0, 420, 280, cSobre).setStrokeStyle(4, 0xd4af37).setVisible(false);
        this.solapa = this.add.graphics().setVisible(false).fillStyle(cSobre).lineStyle(4, 0xd4af37);
        this.solapa.fillTriangle(-210, 0, 210, 0, 0, 150).strokeTriangle(-210, 0, 210, 0, 0, 150);
        this.solapa.y = -140; 
        
        this.papel = this.add.container(0, 0).setAlpha(0).setScale(0.1);
        const hoja = this.add.rectangle(0, 0, 380, 520, 0x2c2c2c).setStrokeStyle(8, 0xd4af37); 
        this.textoMagico = this.add.text(0, 0, '', { fontSize: '22px', fill: '#ffffff', fontFamily: 'Eagle Lake', align: 'center', wordWrap: { width: 320 } }).setOrigin(0.5);
        
        this.papel.add([hoja, this.textoMagico]);
        this.sobreContainer.add([this.papel, this.trasera, this.textoAd, this.frontal, this.solapa]);
        this.crearBotonMistico(midX, midY + 180);
    }
    crearBotonMistico(x, y) {
        this.btnContainer = this.add.container(x, y);
        const aura = this.add.graphics();
        aura.fillStyle(0xd4af37, 0.2); aura.fillCircle(0, 0, 80);
        this.btnContainer.add(aura);
        this.tweens.add({ targets: aura, scale: 1.5, alpha: 0, duration: 2000, repeat: -1 });
        this.emisorBot = this.add.particles(0, 0, 'chispa', { speed: { min: 10, max: 40 }, scale: { start: 0.3, end: 0 }, alpha: { start: 0.8, end: 0 }, lifespan: 1200, blendMode: 'ADD', frequency: 60, tint: [0xffffff, 0x000000] });
        
        const fondo = this.add.graphics();
        fondo.fillGradientStyle(0x333333, 0x333333, 0x111111, 0x111111, 1);
        fondo.fillRoundedRect(-110, -35, 220, 70, 20);
        fondo.lineStyle(4, 0xd4af37, 1);
        fondo.strokeRoundedRect(-110, -35, 220, 70, 20);
        
        const txt = this.add.text(0, 0, 'DESBLOQUEAR', { fontSize: '22px', fontFamily: 'Cinzel Decorative', fill: '#ffd700', fontWeight: 'bold' }).setOrigin(0.5);
        this.btnContainer.add([this.emisorBot, fondo, txt]);
        fondo.setInteractive(new Phaser.Geom.Rectangle(-110, -35, 220, 70), Phaser.Geom.Rectangle.Contains);
        fondo.on('pointerup', () => { if (this.sound.context.state === 'suspended') this.sound.context.resume(); this.sndClic.play(); this.iniciarAnimacionSobre(); this.btnContainer.destroy(); });
    }
    iniciarAnimacionSobre() {
        this.tweens.add({ targets: this.sobreContainer, scaleX: 0, duration: 600, yoyo: true, onYoyo: () => { this.trasera.setVisible(false); this.textoAd.setVisible(false); this.frontal.setVisible(true); this.solapa.setVisible(true); }, onComplete: () => { this.tweens.add({ targets: this.solapa, scaleY: -1, duration: 600, onComplete: () => { this.papel.setPosition(this.cameras.main.centerX, this.cameras.main.centerY); this.sobreContainer.remove(this.papel); this.add.existing(this.papel).setDepth(100); this.tweens.add({ targets: this.papel, scale: 0.8, alpha: 1, angle: 360, duration: 1500, ease: 'Back.easeOut', onComplete: () => { this.escribirTexto("Has entrado a un reino donde el destino nos cruzó...\n\nTengo una pregunta importante al final de este camino.\n\n¿Me acompañas?"); } }); } }); } });
    }
    escribirTexto(m) {
        let i = 0; this.sndEscribir.play();
        this.time.addEvent({ delay: 50, repeat: m.length - 1, callback: () => { this.textoMagico.text += m[i]; i++; if (i === m.length) { this.sndEscribir.stop(); this.crearBotonEntrar(); } } });
    }
    crearBotonEntrar() {
        const midX = this.cameras.main.centerX;
        const midY = this.cameras.main.height - 70; 
        const sello = this.add.circle(midX, midY, 50, 0x333333).setInteractive({ useHandCursor: true }).setDepth(200).setStrokeStyle(3, 0xd4af37);
        this.add.text(midX, midY, 'JUGAR', { fontSize: '20px', fontFamily: 'Cinzel Decorative', fill: '#ffd700' }).setOrigin(0.5).setDepth(201);
        sello.on('pointerup', () => { this.sndClic.play(); this.cameras.main.fadeOut(1000); this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('EscenaJuego')); });
    }
}

class EscenaJuego extends Phaser.Scene {
    constructor() { super('EscenaJuego'); }
    preload() {
        // Precarga de todos los assets del mapa y personajes
        this.load.image('lejano', 'img/fondo_lejano.jpg');
        this.load.image('medio', 'img/fondo_medio.jpg');
        this.load.image('suelo', 'img/suelo.png');
        this.load.image('caja_magica', 'img/caja_misteriosa.png'); 
        this.load.image('moneda_pixel', 'img/corazon_pixel.png');  
        this.load.image('corazon', 'img/corazon_gigante.png');
        this.load.image('perro', 'img/perro.png'); 
        this.load.image('fantasma', 'img/fantasma.png');
        this.load.image('plataforma', 'img/plataforma.png');
        
        // Sprites de Antonio (Tú controlas este personaje)
        this.load.image('tu_frente', 'img/antonio_frente.png');
        this.load.image('tu_der', 'img/antonio_derecha.png');
        this.load.image('tu_izq', 'img/antonio_izquierda.png');
        this.load.image('tu_fin', 'img/antonio_abrazando.png');
        
        // Sprites de Jukary (Ella te espera al final)
        this.load.image('ella_frente', 'img/jukary_frente.png');
        this.load.image('ella_fin', 'img/jukary_abrazando.png');
        
        // Efectos de sonido y música de fondo
        this.load.audio('musica', 'music/musica_romantica_8bit.mp3');
        this.load.audio('salto', 'music/salto.mp3');
        this.load.audio('sonido_caja', 'music/caja.mp3');
        this.load.audio('ladrido', 'music/ladrido.mp3');
        this.load.audio('collect', 'music/collect.mp3');
        this.load.audio('bump', 'music/bump.mp3');
    }
    create() {
        this.input.addPointer(3);
        const anchoNivel = 6000;
        this.juegoTerminado = false; this.puntos = 0; this.invulnerable = false;
        
        this.bgLejano = this.add.tileSprite(0, 0, anchoNivel, 600, 'lejano').setOrigin(0).setScrollFactor(0);
        this.bgMedio = this.add.tileSprite(0, 0, anchoNivel, 600, 'medio').setOrigin(0).setScrollFactor(0);
        
        this.physics.world.setBounds(0, 0, anchoNivel, this.cameras.main.height);
        
        const sueloY = this.cameras.main.height - 15;
        this.sueloGroup = this.physics.add.staticGroup();
        for (let x = 0; x < anchoNivel; x += 32) { this.sueloGroup.create(x, sueloY, 'suelo').refreshBody(); }
        
        this.plataformas = this.physics.add.group({ allowGravity: false, immovable: true });
        const cp = [1200, 2100, 3000, 3900, 4800];
        const platY = this.cameras.main.height - 140;
        cp.forEach(px => { let p = this.plataformas.create(px, platY, 'plataforma'); p.body.checkCollision.down = false; });
        
        const jugadorY = this.cameras.main.height - 150;
        this.jugador = this.physics.add.sprite(100, jugadorY, 'tu_frente').setCollideWorldBounds(true).setDepth(100);
        this.pareja = this.physics.add.sprite(5850, jugadorY, 'ella_frente').setDepth(100);
        this.perro = this.physics.add.sprite(6000, jugadorY + 50, 'perro').setScale(0.8).setAlpha(0).setDepth(150).setFlipX(true);
        
        this.physics.add.collider(this.jugador, this.sueloGroup);
        this.physics.add.collider(this.jugador, this.plataformas);
        this.physics.add.collider(this.pareja, this.sueloGroup);
        this.physics.add.collider(this.perro, this.sueloGroup);
        
        this.cameras.main.setBounds(0, 0, anchoNivel, this.cameras.main.height);
        this.cameras.main.startFollow(this.jugador, true, 0.1, 0.1, 0, 70);
        
        this.textoPuntos = this.add.text(16, 16, 'CORAZONES: 0/10', { fontSize: '24px', fill: '#fff', fontFamily: 'Cinzel Decorative', stroke: '#000', strokeThickness: 4 }).setScrollFactor(0).setDepth(2000);
        
        this.musicaFondo = this.sound.add('musica', { loop: true, volume: 0.1 });
        this.sndSalto = this.sound.add('salto', { volume: 0.4 });
        this.sndCaja = this.sound.add('sonido_caja', { volume: 0.5 });
        this.sndLadrido = this.sound.add('ladrido', { volume: 0.6 });
        this.sndCollect = this.sound.add('collect', { volume: 0.5 });
        this.sndBump = this.sound.add('bump', { volume: 0.5 });
        
        this.configurarCajasYMonedas(cp); this.crearObstaculos(); this.crearControlesMovil();
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.jugador, this.pareja, () => this.finalizarJuego());
    }
    crearControlesMovil() {
        this.btnIzq = false; this.btnDer = false; this.btnSalto = false;
        const h = this.cameras.main.height; const w = this.cameras.main.width;
        const sb = (x, y, t, p) => {
            let b = this.add.circle(x, y, 60, 0xffffff, 0.2).setScrollFactor(0).setDepth(5000).setInteractive();
            this.add.text(x, y, t, { fontSize: '40px' }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);
            b.on('pointerdown', () => { this[p] = true; b.setAlpha(0.5); });
            b.on('pointerup', () => { this[p] = false; b.setAlpha(0.2); });
            b.on('pointerout', () => { this[p] = false; b.setAlpha(0.2); });
        };
        sb(80, h - 80, '◀', 'btnIzq'); sb(200, h - 80, '▶', 'btnDer'); sb(w - 80, h - 80, '▲', 'btnSalto');
    }
    configurarCajasYMonedas(cp) {
        this.textoCartel = this.add.text(0, 0, '', { fontSize: '20px', fill: '#fff', backgroundColor: '#1a1a1a', padding: { x: 15, y: 10 }, align: 'center', wordWrap: { width: 300 } }).setOrigin(0.5, 1).setVisible(false).setDepth(2000).setStroke('#d4af37', 4);
        
        // Pistas y frases para Jukary
        const ms = [
            "¡Hola, Jukary! Antonio te ha preparado una sorpresa aquí... 🖤",
            "Cada segundo a tu lado se ha convertido en mi aventura favorita.",
            "Me encanta tu sonrisa, tu forma de ser y todo lo que somos juntos.",
            "Gracias por ser mi lugar seguro y mi mayor felicidad.",
            "Ya casi cruzas todo el mapa... ¡Antonio te espera al final! ✨",
            "¡Eres la jugadora número 1 de mi vida! Mira hacia adelante..."
        ];
        
        this.monedas = this.physics.add.group();
        const monedaY = 600 - 220; 
        const cajaY = 600 - 320;
        
        cp.forEach((px, i) => {
            this.monedas.create(px, monedaY, 'moneda_pixel').setScale(1.2).body.setAllowGravity(false);
            let c = this.add.sprite(px + 60, cajaY, 'caja_magica'); this.physics.add.existing(c, true);
            c.mensaje = ms[i] || "¡Te amo!"; c.disponible = true; this.vincularColisionCaja(c);
        });
        const extraY = 600 - 120;
        for(let j=0; j<5; j++) { this.monedas.create(600 + (j * 1100), extraY, 'moneda_pixel').setScale(1.2).body.setAllowGravity(false); }
        this.physics.add.overlap(this.jugador, this.monedas, (p, m) => { m.destroy(); this.puntos++; this.textoPuntos.setText(`CORAZONES: ${this.puntos}/10`); this.sndCollect.play(); });
    }
    vincularColisionCaja(c) {
        this.physics.add.collider(this.jugador, c, (o1, o2) => {
            if (o1.body.touching.up && o2.body.touching.down && c.disponible) { 
                c.disponible = false; this.sndCaja.play();
                this.textoCartel.setPosition(c.x, c.y - 60).setText(c.mensaje).setVisible(true).setScale(0).setAlpha(1);
                this.tweens.add({ targets: this.textoCartel, scale: 1, duration: 300, ease: 'Back.easeOut' });
                this.time.delayedCall(2500, () => { this.tweens.add({ targets: this.textoCartel, alpha: 0, duration: 500, onComplete: () => { this.textoCartel.setVisible(false); c.disponible = true; }}); });
            }
        });
    }
    crearObstaculos() {
        this.fantasmas = this.physics.add.group({ allowGravity: false });
        const pf = [1500, 2600, 3500, 4400, 5200];
        const fanY = this.cameras.main.height - 70;
        pf.forEach(dx => {
            let f = this.fantasmas.create(dx, fanY, 'fantasma').setScale(1.5);
            this.tweens.add({ targets: f, x: dx + 300, duration: 2000, yoyo: true, repeat: -1 });
        });
        this.physics.add.overlap(this.jugador, this.fantasmas, () => {
            if (!this.invulnerable && !this.juegoTerminado) {
                this.invulnerable = true; this.sndBump.play();
                this.jugador.setVelocityX(-100); this.jugador.setVelocityY(-150);
                this.tweens.add({ targets: this.jugador, alpha: 0.3, duration: 100, yoyo: true, repeat: 5, onComplete: () => { this.invulnerable = false; this.jugador.setAlpha(1); } });
            }
        });
    }
    update() {
        if (this.juegoTerminado) return;
        this.bgLejano.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.bgMedio.tilePositionX = this.cameras.main.scrollX * 0.6;
        const izq = this.cursors.left.isDown || this.btnIzq;
        const der = this.cursors.right.isDown || this.btnDer;
        const salto = this.cursors.up.isDown || this.btnSalto;
        if (!this.invulnerable) {
            if (izq) { this.jugador.setVelocityX(-320).setTexture('tu_izq'); }
            else if (der) { this.jugador.setVelocityX(320).setTexture('tu_der'); if(!this.musicaFondo.isPlaying) this.musicaFondo.play(); }
            else { this.jugador.setVelocityX(0).setTexture('tu_frente'); }
        }
        if (salto && this.jugador.body.touching.down) { this.jugador.setVelocityY(-850); this.sndSalto.play(); }
    }
    finalizarJuego() {
        if (this.juegoTerminado) return;
        this.juegoTerminado = true; 
        this.jugador.setVelocity(0); 
        this.textoPuntos.setVisible(false);
        this.cameras.main.stopFollow();

        this.jugador.setTexture('tu_fin'); 
        this.pareja.setTexture('ella_fin');
        
        let co = this.add.image(this.pareja.x - 20, this.pareja.y - 120, 'corazon').setDepth(1000);
        this.tweens.add({ targets: co, scale: 8, alpha: 0, y: '-=250', duration: 2000 });
        
        this.perro.setAlpha(1);
        this.tweens.add({ 
            targets: this.perro, x: this.pareja.x - 150, duration: 1500, 
            onComplete: () => this.escribirPreguntaFinal() 
        });
    }
    escribirPreguntaFinal() {
        let m = "¡LEVEL CLEAR!\n\nJukary, has recolectado todos los corazones de Antonio...\n\nSolo queda una última pregunta por responder:\n\n¿QUIERES SER MI NOVIA OFICIALMENTE? 🖤";
        
        this.txtPerro = this.add.text(this.cameras.main.scrollX + (this.cameras.main.width / 2), this.cameras.main.height / 3, "", { 
            fontSize: '24px', fill: '#ffd700', fontFamily: 'Cinzel Decorative', 
            align: 'center', stroke: '#000', strokeThickness: 5, wordWrap: { width: 600 }
        }).setOrigin(0.5).setDepth(9999);
        
        let ci = 0;
        this.time.addEvent({ 
            delay: 60, repeat: m.length - 1, 
            callback: () => { 
                this.txtPerro.text += m[ci]; ci++; 
                if (ci === m.length) { 
                    this.mostrarBotonesRespuesta(); 
                } 
            } 
        });
    }
    mostrarBotonesRespuesta() {
        const camX = this.cameras.main.scrollX + (this.cameras.main.width / 2);
        const camY = this.cameras.main.height - 120;

        let btnSi = this.add.rectangle(camX - 120, camY, 180, 60, 0x00ff00).setDepth(10000).setInteractive({useHandCursor:true}).setAlpha(0);
        let txtSi = this.add.text(camX - 120, camY, '¡SÍ! 👑', { fontSize: '22px', fill: '#000', fontWeight: 'bold' }).setOrigin(0.5).setDepth(10001).setAlpha(0);
        
        let btnNo = this.add.rectangle(camX + 120, camY, 180, 60, 0xff0000).setDepth(10000).setInteractive({useHandCursor:true}).setAlpha(0);
        let txtNo = this.add.text(camX + 120, camY, 'NO 😢', { fontSize: '22px', fill: '#000', fontWeight: 'bold' }).setOrigin(0.5).setDepth(10001).setAlpha(0);
        
        this.tweens.add({ targets: [btnSi, txtSi, btnNo, txtNo], alpha: 1, duration: 800 });
        
        // RECUERDA: Cambiar 'tu_numero_aqui' por tu número telefónico real (Ej: 1809XXXXXXX)
        btnSi.on('pointerup', () => { 
            window.open('https://wa.me/tu_numero_aqui?text=¡SÍ,%20Antonio!%20Acepto%20ser%20tu%20novia%20oficial%20🖤', '_blank'); 
        });
        
        // Trampa divertida: Si intenta posicionarse sobre el "NO", el botón huye
        btnNo.on('pointerover', () => {
            btnNo.x = Phaser.Math.Between(camX - 200, camX + 200);
            btnNo.y = Phaser.Math.Between(camY - 100, camY + 50);
            txtNo.x = btnNo.x;
            txtNo.y = btnNo.y;
        });
    }
}

// Configuración global de Phaser
const config = {
    type: Phaser.AUTO,
    scale: { 
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.CENTER_BOTH, 
        parent: 'game-container',
        width: 1024,
        height: 600
    },
    physics: { 
        default: 'arcade', 
        arcade: { gravity: { y: 1900 }, debug: false } 
    },
    scene: [EscenaIntro, EscenaJuego]
};

const game = new Phaser.Game(config);

window.addEventListener('load', () => { 
    setTimeout(() => { if (game.scale) { game.scale.refresh(); } }, 400); 
});
