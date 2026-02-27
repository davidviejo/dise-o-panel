import time
from playwright.sync_api import sync_playwright

def verify_frontend_public_clients():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the landing page
        # Assuming frontend runs on port 5173
        page.goto("http://localhost:5173/")

        # Wait for the projects section to load (it might show a spinner first)
        page.wait_for_selector("#projects")

        # Check if the client names are visible
        # Based on clients_db.json, we expect "Diego Casas" and "Demo Project"
        try:
            page.wait_for_selector("text=Diego Casas", timeout=5000)
            page.wait_for_selector("text=Demo Project", timeout=5000)
            print("SUCCESS: Public clients are visible on the landing page.")
        except Exception as e:
            print(f"FAILURE: Could not find client names. Error: {e}")
            page.screenshot(path="frontend_verification_failure.png")
            browser.close()
            return

        # Take a screenshot for visual verification
        page.screenshot(path="frontend_verification_success.png", full_page=True)
        print("Screenshot saved to frontend_verification_success.png")

        browser.close()

if __name__ == "__main__":
    # Give some time for the servers to start up if they were just launched
    time.sleep(5)
    verify_frontend_public_clients()
