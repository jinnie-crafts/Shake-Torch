class SettingsManager {
  constructor() {
    this.defaultSettings = {
      sensitivity: 'MEDIUM',
      torchOnShake: true,
      lockOnShake: false,
      isServiceEnabled: false
    };
    this.settings = this.loadSettings();
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem('shaketorch_settings');
      if (stored) {
        return { ...this.defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    return { ...this.defaultSettings };
  }

  saveSettings() {
    try {
      localStorage.setItem('shaketorch_settings', JSON.stringify(this.settings));
      // Notify native bridge
      window.Bridge.updateSettings(this.settings);
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }

  update(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }

  get(key) {
    return this.settings[key];
  }
}

window.Settings = new SettingsManager();
