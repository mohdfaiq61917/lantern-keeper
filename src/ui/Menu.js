export class Menu {
  constructor(game) {
    this.game = game;
    this.visible = true;
    this.panel = 'main';
    this.buttons = [];
    this.hoverIndex = -1;
    this.updateButtons();
  }

  show() {
    this.visible = true;
    this.panel = 'main';
    this.updateButtons();
  }

  hide() {
    this.visible = false;
  }

  updateButtons() {
    if (!this.visible) {
      this.buttons = [];
      return;
    }

    if (this.panel === 'main') {
      this.buttons = [
        { id: 'survival', label: 'Survival', x: 0.28, y: 0.36, w: 0.44, h: 0.08, action: () => this.game.startMode('survival') },
        { id: 'daily', label: 'Daily Challenge', x: 0.28, y: 0.47, w: 0.44, h: 0.08, action: () => this.game.startMode('daily') },
        { id: 'boss', label: 'Boss Rush', x: 0.28, y: 0.58, w: 0.44, h: 0.08, action: () => this.game.startMode('boss') },
        { id: 'zen', label: 'Zen Mode', x: 0.28, y: 0.69, w: 0.44, h: 0.08, action: () => this.game.startMode('zen') },
        { id: 'settings', label: 'Settings', x: 0.28, y: 0.8, w: 0.2, h: 0.07, action: () => this.setPanel('settings') },
        { id: 'help', label: 'How To Play', x: 0.52, y: 0.8, w: 0.2, h: 0.07, action: () => this.setPanel('help') }
      ];
    } else if (this.panel === 'settings') {
      this.buttons = [
        { id: 'volumeUp', label: 'Volume +', x: 0.28, y: 0.38, w: 0.18, h: 0.07, action: () => this.game.applySettings({ volume: Math.min(1, (this.game.settings.volume ?? 0.5) + 0.1) }) },
        { id: 'volumeDown', label: 'Volume -', x: 0.52, y: 0.38, w: 0.18, h: 0.07, action: () => this.game.applySettings({ volume: Math.max(0, (this.game.settings.volume ?? 0.5) - 0.1) }) },
        { id: 'shake', label: 'Screen Shake: On', x: 0.28, y: 0.52, w: 0.42, h: 0.08, action: () => this.game.applySettings({ screenShake: !this.game.settings.screenShake }) },
        { id: 'palette', label: 'Palette: Normal', x: 0.28, y: 0.64, w: 0.42, h: 0.08, action: () => this.game.applySettings({ palette: this.game.settings.palette === 'none' ? 'proto' : 'none' }) },
        { id: 'back', label: 'Back', x: 0.4, y: 0.82, w: 0.2, h: 0.08, action: () => this.setPanel('main') }
      ];
    } else if (this.panel === 'help') {
      this.buttons = [
        { id: 'back', label: 'Back', x: 0.4, y: 0.82, w: 0.2, h: 0.08, action: () => this.setPanel('main') }
      ];
    }
  }

  setPanel(panel) {
    this.panel = panel;
    this.updateButtons();
  }

  handlePointer(event) {
    if (!this.visible) return;
    const rect = this.game.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    for (const button of this.buttons) {
      const bx = button.x * this.game.canvas.width;
      const by = button.y * this.game.canvas.height;
      const bw = button.w * this.game.canvas.width;
      const bh = button.h * this.game.canvas.height;
      if (x * this.game.canvas.width >= bx && x * this.game.canvas.width <= bx + bw && y * this.game.canvas.height >= by && y * this.game.canvas.height <= by + bh) {
        button.action();
        return;
      }
    }
  }

  draw(ctx, width, height) {
    if (!this.visible) return;

    ctx.fillStyle = 'rgba(5, 11, 18, 0.6)';
    ctx.fillRect(0, 0, width, height);

    const panelX = width * 0.18;
    const panelY = height * 0.1;
    const panelW = width * 0.64;
    const panelH = height * 0.8;

    ctx.fillStyle = 'rgba(10, 18, 28, 0.88)';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = 'rgba(122, 231, 255, 0.28)';
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    ctx.fillStyle = '#edf5ff';
    ctx.font = 'bold 36px sans-serif';
    if (this.panel === 'main') {
      ctx.fillText('Lantern Keeper', width * 0.5 - 150, height * 0.2);
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#b6cde8';
      ctx.fillText('Keep the lantern alive. Survive the dark.', width * 0.5 - 180, height * 0.25);
    } else if (this.panel === 'settings') {
      ctx.fillText('Settings', width * 0.5 - 80, height * 0.2);
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#b6cde8';
      ctx.fillText(`Volume: ${((this.game.settings.volume ?? 0.5) * 100).toFixed(0)}%`, width * 0.28, height * 0.33);
      ctx.fillText(`Screen shake: ${this.game.settings.screenShake ? 'On' : 'Off'}`, width * 0.28, height * 0.47);
      ctx.fillText(`Palette: ${this.game.settings.palette === 'none' ? 'Normal' : 'Proto'}`, width * 0.28, height * 0.59);
    } else if (this.panel === 'help') {
      ctx.fillText('How to Play', width * 0.5 - 110, height * 0.2);
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#b6cde8';
      const lines = [
        'Move with WASD or arrow keys.',
        'The lantern auto-fires at the nearest enemy inside its light radius.',
        'Collect gem drops to fill your XP bar and level up.',
        'Each level up grants a random upgrade, choose wisely.',
        'Survive long enough to beat the shadows.'
      ];
      lines.forEach((line, i) => {
        ctx.fillText(line, width * 0.22, height * 0.3 + i * 28);
      });
    }

    for (const button of this.buttons) {
      const bx = button.x * width;
      const by = button.y * height;
      const bw = button.w * width;
      const bh = button.h * height;
      ctx.fillStyle = 'rgba(122, 231, 255, 0.15)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = 'rgba(122, 231, 255, 0.28)';
      ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = '#edf5ff';
      ctx.font = '20px sans-serif';
      ctx.fillText(button.label, bx + 18, by + bh * 0.63);
    }
  }
}
