export class Dashboard {
  constructor ({ dashboard, timezone = 'browser' }) {
    this.dashboard = {
      ...dashboard,
      panels: dashboard.panels || [],
      timezone
    }
  }

  addPanel ({ panel }) {
    this.dashboard.panels.push(panel)
  }

  hasPanel ({ panel }) {
    return this.dashboard.panels.find(p => p.title === panel.title)
  }

  deletePanel ({ panel }) {
    this.dashboard.panels = this.dashboard.panels.filter(p => p.title !== panel.title)
  }

  totalPanels () {
    return this.dashboard.panels.length
  }
}
