chrome.action.onClicked.addListener(async (tab) => {
  try {
    const url = new URL(tab.url);
    const domain = url.hostname;
    
    // Get all cookies for this domain
    const cookies = await chrome.cookies.getAll({ domain: domain });
    
    // Delete each cookie
    let deletedCount = 0;
    for (const cookie of cookies) {
      const protocol = cookie.secure ? "https:" : "http:";
      const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
      
      await chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: cookie.storeId
      });
      deletedCount++;
    }
    
    // Also check for cookies without the leading dot
    const altDomain = domain.startsWith('www.') ? domain.substring(4) : 'www.' + domain;
    const altCookies = await chrome.cookies.getAll({ domain: altDomain });
    
    for (const cookie of altCookies) {
      const protocol = cookie.secure ? "https:" : "http:";
      const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
      
      await chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: cookie.storeId
      });
      deletedCount++;
    }
    
    console.log(`Deleted ${deletedCount} cookies for ${domain}`);
    
    // Optional: Show a badge with count
    chrome.action.setBadgeText({ text: deletedCount.toString(), tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#fb1818ff', tabId: tab.id });
    
    // Clear badge after 2 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '', tabId: tab.id });
    }, 2000);
    
  } catch (error) {
    console.error('Error deleting cookies:', error);
    chrome.action.setBadgeBackgroundColor({ color: '#00ffeaff', tabId: tab.id });
  }
});