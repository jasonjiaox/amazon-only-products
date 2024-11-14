import iconOff from "data-base64:../assets/icon32_off.png"
import iconOn from "data-base64:../assets/icon32_on.png"

// Manages the extension's on/off state
class ExtensionStateManager {
  private isEnabled: boolean

  constructor(initialState: boolean) {
    this.isEnabled = initialState
  }

  getState(): boolean {
    return this.isEnabled
  }

  toggleState(): void {
    this.isEnabled = !this.isEnabled
  }
}

// Initialize extension state and constants
const extensionState = new ExtensionStateManager(true)
const filterKey = "p_6"

// Amazon marketplace seller IDs
const queryParams = {
  "www.amazon.com": { value: "ATVPDKIKX0DER" },
  "www.amazon.ca": { value: "A3DWYIK6Y9EEQB" },
  "www.amazon.co.uk": { value: "A3P5ROKL5A1OLE" },
  "www.amazon.com.mx": { value: "AVDBXBAVVSXLQ" },
  "www.amazon.com.br": { value: "A1ZZFT5FULY4LN" },
  "www.amazon.fr": { value: "A1X6FK5RDHNB96" },
  "www.amazon.de": { value: "A3JWKAKR8XB7XF" },
  "www.amazon.it": { value: "A11IL2PNWYJU7H" },
  "www.amazon.es": { value: "A1AT7YVPFBWXBL" },
  "www.amazon.co.jp": { value: "AN1VRQENFRJN5" },
  "www.amazon.com.be": { value: "A3Q3FYJVX702M2" },
  "www.amazon.nl": { value: "A17D2BRD4YMT0X" },
  "www.amazon.pl": { value: "A2R2221NX79QZP" },
  "www.amazon.se": { value: "ANU9KP01APNAG" },
  "www.amazon.com.tr": { value: "A1UNQM1SR2CHM" },
  "www.amazon.com.au": { value: "ANEGB3WVEVKZB" },
  "www.amazon.ae": { value: "A2KKU8J8O8784X" },
//   "www.amazon.in": { value: "A21TJRUUN4KGV" },
//   "www.amazon.sg": { value: "A19VAU5U5O7RUS" }
}

// Update icon based on extension state
const updateIcon = () => {
  chrome.action.setIcon({ path: extensionState.getState() ? iconOn : iconOff })
}

// Handle URL updates
const handleUrlUpdate = (url: URL, filter: any, tabId: number) => {
  const hasSearchParam = url.searchParams.has("k")
  const hasFilterParam = url.searchParams.has("rh")

  if (extensionState.getState()) {
    if (hasSearchParam && !hasFilterParam) {
      url.searchParams.append("rh", `${filterKey}:${filter.value}`)
      chrome.tabs.update(tabId, { url: url.toString() })
    }
  } else if (hasSearchParam && hasFilterParam) {
    url.searchParams.delete("rh")
    chrome.tabs.update(tabId, { url: url.toString() })
  }
}

// Extension icon click handler
chrome.action.onClicked.addListener((tab) => {
  extensionState.toggleState()
  updateIcon()

  if (!tab.url) return

  const url = new URL(tab.url)
  const filter = queryParams[url.hostname]
  handleUrlUpdate(url, filter, tab.id)
})

// Tab update handler
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  updateIcon()

  if (!tab.url) return

  const url = new URL(tab.url)
  const filter = queryParams[url.hostname]

  if (
    extensionState.getState() &&
    url.searchParams.has("k") &&
    !url.searchParams.has("rh")
  ) {
    url.searchParams.append("rh", `${filterKey}:${filter.value}`)
    chrome.tabs.update(tabId, { url: url.toString() })
  }
})
