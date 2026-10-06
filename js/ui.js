class UIController {
  constructor() {
    this.statusDot = document.getElementById('status-dot');
    this.statusText = document.getElementById('status-text');
    this.toggleService = document.getElementById('toggle-service');
    this.toggleTorch = document.getElementById('toggle-torch');
    this.toggleLock = document.getElementById('toggle-lock');
    this.sensitivityBtns = document.querySelectorAll('.segment');
    
    this.capSensors = document.querySelector('#cap-sensors .cap-status');
    this.capTorch = document.querySelector('#cap-torch .cap-status');
    this.capLock = document.querySelector('#cap-lock .cap-status');

    this.diagnosticPanel = document.getElementById('diagnostic-panel');
    this.diagAccel = document.getElementById('diag-accel');
    this.diagGyro = document.getElementById('diag-gyro');
    this.diagShake = document.getElementById('diag-shake');
    this.diagTorch = document.getElementById('diag-torch');
    this.diagCooldown = document.getElementById('diag-cooldown');
    
    this.logoTaps = 0;

    this.init();
  }

  init() {
    // Sync UI with settings
    const currentSettings = window.Settings.settings;
    this.toggleTorch.checked = currentSettings.torchOnShake;
    this.toggleLock.checked = currentSettings.lockOnShake;
    this.toggleService.checked = currentSettings.isServiceEnabled;
    this.setSensitivityUI(currentSettings.sensitivity);

    // Event Listeners
    this.toggleService.addEventListener('change', (e) => {
      const isEnabled = e.target.checked;
      window.Settings.update('isServiceEnabled', isEnabled);
      if (isEnabled) {
        window.Bridge.startService();
      } else {
        window.Bridge.stopService();
      }
    });

    this.toggleTorch.addEventListener('change', (e) => {
      window.Settings.update('torchOnShake', e.target.checked);
    });

    this.toggleLock.addEventListener('change', (e) => {
      window.Settings.update('lockOnShake', e.target.checked);
    });

    this.sensitivityBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const value = e.target.dataset.value;
        window.Settings.update('sensitivity', value);
        this.setSensitivityUI(value);
      });
    });

    // Hidden Dev Mode Trigger
    const logo = document.querySelector('.logo h1');
    if (logo) {
      logo.addEventListener('click', () => {
        this.logoTaps++;
        if (this.logoTaps === 5) {
          this.diagnosticPanel.style.display = 'block';
          window.Bridge.setDiagnosticMode(true);
        }
      });
    }
  }

  setSensitivityUI(value) {
    this.sensitivityBtns.forEach(btn => {
      if (btn.dataset.value === value) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updateServiceStatus(isRunning) {
    if (isRunning) {
      this.statusDot.className = 'status-dot running';
      this.statusText.textContent = 'Running';
      this.toggleService.checked = true;
      window.Settings.update('isServiceEnabled', true);
    } else {
      this.statusDot.className = 'status-dot stopped';
      this.statusText.textContent = 'Stopped';
      this.toggleService.checked = false;
      window.Settings.update('isServiceEnabled', false);
    }
  }

  updateCapabilities(caps) {
    this._updateCapUI(this.capSensors, caps.sensorsAvailable);
    this._updateCapUI(this.capTorch, caps.torchAvailable);
    this._updateCapUI(this.capLock, caps.lockAvailable);
  }

  _updateCapUI(element, isAvailable) {
    if (isAvailable) {
      element.textContent = 'Ready';
      element.className = 'cap-status ok';
    } else {
      element.textContent = 'Setup required';
      element.className = 'cap-status error';
    }
  }

  updateDiagnostics(data) {
    if (data.accelGate !== undefined) this.diagAccel.textContent = data.accelGate ? 'TRIGGERED' : 'IDLE';
    if (data.gyroGate !== undefined) this.diagGyro.textContent = data.gyroGate ? 'TRIGGERED' : 'IDLE';
    if (data.shake !== undefined) this.diagShake.textContent = data.shake ? 'CONFIRMED' : 'NO';
    if (data.torch !== undefined) this.diagTorch.textContent = data.torch ? 'ON' : 'OFF';
    if (data.cooldown !== undefined) this.diagCooldown.textContent = data.cooldown ? 'ACTIVE' : 'READY';
  }
}

window.UIHandler = new UIController();
