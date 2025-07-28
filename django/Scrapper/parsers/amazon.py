import requests
from bs4 import BeautifulSoup

# HEADERS = {"User-Agent": "Mozilla/5.0"}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.amazon.in/"
}

def parse_amazon_product(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ HTTP error fetching {url}: {e}")
        return None

    soup = BeautifulSoup(r.content, "html.parser")

    # Check if we were blocked
    if soup.find("form", action="/errors/validateCaptcha"):
        print("🚧 CAPTCHA detected on this page. Scraper blocked.")
        return None

    # Safely extract data
    title_div = soup.find("div", class_="p13n-sc-truncate-desktop-type2")

    title = None
    if title_div:
    # Option 1: Get the title from the 'title' attribute (most reliable for full text)
        title = title_div.get('title')
    
    if not title: # Fallback to text content if title attribute is not present (less likely for this div)
        title = title_div.get_text(strip=True)


    price_el = soup.find("span", {"class": "a-price-whole"})
    if not price_el:
        # Try another selector sometimes used by Amazon
        price_el = soup.find("span", {"class": "a-offscreen"})

    if price_el:
        price_text = price_el.get_text(strip=True).replace(",", "").replace("₹", "")
        try:
            price = float(price_text)
        except ValueError:
            price = None
    else:
        price = None

    img_tag = soup.find(id="landingImage")
    img = img_tag["src"] if img_tag else None

    # Debug logs
    if not title or not price or not img:
        print(f"⚠️ Missing fields for {url}: title={title}, price={price}, image={img}")

    return {
        "site": "amazon",
        "url": url,
        "title": title,
        "price": price,
        "image": img
    }
   

def get_amazon_featured():
    url = "https://www.amazon.in/gp/bestsellers/"
    r = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(r.content, "html.parser")
    # print(soup.prettify())
    items = []
    for div in soup.find_all("div", class_="p13n-sc-uncoverable-faceout"):
        
        img = div.find("img")["src"]
        product_url = "https://www.amazon.in" + div.find("a")["href"]
        

        # print(product_url)

        title_div = soup.find("div", class_="p13n-sc-truncate-desktop-type2")

        title = None
        if title_div:
        # Option 1: Get the title from the 'title' attribute (most reliable for full text)
            title = title_div.get('title')
        
        if not title: # Fallback to text content if title attribute is not present (less likely for this div)
            title = title_div.get_text(strip=True)

        # print(title)

        price_el = div.find("span", {"class": "_cDEzb_p13n-sc-price_3mJ9Z"})
        if not price_el:
            # Try another selector sometimes used by Amazon
            price_el = div.find("span", {"class": "a-offscreen"})

        if price_el:
            price_text = price_el.get_text(strip=True).replace(",", "").replace("₹", "")
            try:
                price = float(price_text)
            except ValueError:
                price = None
        else:
            price = None
        # prices on best seller pages vary
        # print(price)
        items.append({
            "site": "amazon",
            "url": product_url,
            "title": title,
            "price": price,
            "image": img,
        })
    return items
