from playwright.sync_api import Page, expect, sync_playwright

def verify_login_screen(page: Page):
  try:
    page.goto("http://localhost:8081/login", timeout=60000)
    page.wait_for_timeout(2000) # Wait for potential redirects or renders

    # Take a debug screenshot
    page.screenshot(path="/app/debug_screenshot.png")

    # Check what text is visible
    content = page.content()
    print("Page Content Length:", len(content))

    if "COMMAND CENTER" in content:
        print("Redirected to HUD (Command Center)")

    if "SENTINEL" in content:
        print("Found SENTINEL")

  except Exception as e:
    print(f"Error: {e}")
    page.screenshot(path="/app/error_screenshot.png")

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
      verify_login_screen(page)
    finally:
      browser.close()
