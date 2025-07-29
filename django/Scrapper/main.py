from parsers.amazon import parse_amazon_product, get_amazon_featured
# from parsers.flipkart import parse_flipkart_product, get_flipkart_featured
# from parsers.myntra import parse_myntra_product, get_myntra_featured

def scrape_product(url):
    if "amazon.in" or "amzn.in" in url:
        return parse_amazon_product(url)
    # elif "flipkart.com" in url:
    #     return parse_flipkart_product(url)
    # elif "myntra.com" in url:
    #     return parse_myntra_product(url)
    else:
        raise ValueError("Unsupported website URL")

def get_all_featured():
    return (
        get_amazon_featured()
        # + get_flipkart_featured()
        # + get_myntra_featured()
    )

# for quick manual test
if __name__ == "__main__":
    url = "https://amzn.in/d/1NYcgav"
    print(scrape_product(url))
    # get_all_featured()
