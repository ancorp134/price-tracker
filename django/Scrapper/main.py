from parsers.amazon import parse_amazon_product, get_amazon_featured
# from parsers.flipkart import parse_flipkart_product, get_flipkart_featured
# from parsers.myntra import parse_myntra_product, get_myntra_featured

def scrape_product(url):
    if "amazon.in" in url:
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
    url = "https://www.amazon.in/WHP-Jewellers-Goddess-Lakshmi-Pendant/dp/B099DTKV1V/262-9944029-3436465?pd_rd_w=yDwTI&content-id=amzn1.sym.7f3d66f6-5df6-41bc-b3bc-9782a34ce834&pf_rd_p=7f3d66f6-5df6-41bc-b3bc-9782a34ce834&pf_rd_r=4609RTA694G3YB2QQ3NV&pd_rd_wg=2gZYX&pd_rd_r=8b95a677-9d40-40ec-b15e-e0e45d6a3e37&pd_rd_i=B099DTKV1V&psc=1"
    # print(scrape_product(url))
    get_all_featured()
