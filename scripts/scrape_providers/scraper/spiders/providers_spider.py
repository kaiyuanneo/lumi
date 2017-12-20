import html

import bs4
import scrapy


"""
Information that we want:
- Service name
- Address
- Phone number
- Operating hours
"""

PROVIDER_OUTPUT_FILE_NAME = 'provider_data.tsv'
EMPTY_FIELD_DELIMITER = 'NA'

HEADERS = {
    'Content-Length': '385',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'm.healthhub.sg',
    'Origin': 'https://www.silverpages.sg',
    'Referer': 'https://www.silverpages.sg/_layouts/15/appredirect.aspx?redirect_uri=https://m.healthhub.sg/PHApps/SSP/AIC.SSP.ECare/Pages/SearchByServiceProvider.aspx?SPHostUrl=https%3A%2F%2Fwww%2Esilverpages%2Esg&SPHostTitle=SilverPages&SPAppWebUrl=%22%22&SPLanguage=en%2DUS&SPClientTag=3&SPProductNumber=15%2E0%2E4569%2E1000&client_id=i:0i.t|ms.sp.ext|91cfabec-512c-4cdf-be32-fbfc59c6800c@13b6aa75-fe33-4dcd-8245-7f24f080cfe9&anon=1&anon=1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
}

COOKIES = {
    'visid_incap_557817': 'of5O/OfoRaaX/Cs/n2BLkQlAFVoAAAAATkIPAAAAAAChFoRwufhYJng7o20EoRGE',
    '_gac_UA-58524573-1': '1.1511342093.EAIaIQobChMImtDZyevR1wIV2RwrCh3IgwZzEAAYASAAEgLEcfD_BwE',
    'visid_incap_873637': 'p+ZS/RY5QjGXBZUfjPAk/b7q7lkAAAAAQUIPAAAAAAAMg0dlWvkBe+7/25U/oJeY',
    '_ga': 'GA1.2.26133011.1508829888',
    'ASP.NET_SessionId': 'zbbf110pmceh2gycglnw0jbv',
    'AWSELB': '0197D7691088C1B6B5B4D49348C137E6E65D9EDD5218D38B829055D0A75DE43289739877A8E7F4E1D1BA57A16046CB8C630178EADC60E3B3A859D4D8A06B2572297579FBF2',
    'incap_ses_964_873637': '3m1GLxJ0MjiwI6fL9NBgDdlwN1oAAAAAYA+Y4SL07VvR3TSTBOmBqg==',
    '_gid': 'GA1.2.551880067.1513582811',
}

FORM_DATA = {
    'SPAppToken': '',
    'SPSiteUrl': 'http://www.silverpages.sg',
    'SPSiteTitle': 'SilverPages',
    'SPSiteLogoUrl': '',
    'SPSiteLanguage': 'en-US',
    'SPSiteCulture': 'en-US',
    'SPRedirectMessage': '',
    'SPErrorCorrelationId': '20ac379e-9c70-90fe-01e2-79e5b33bc0ee',
    'SPErrorInfo': 'The app i:0i.t|ms.sp.ext|91cfabec-512c-4cdf-be32-fbfc59c6800c@13b6aa75-fe33-4dcd-8245-7f24f080cfe9 does not have an endpoint or its endpoint is not valid.',
}


class ProvidersSpider(scrapy.Spider):
    name = 'providers'

    def __init__(self, *args, **kwargs):
        super(ProvidersSpider, self).__init__(*args, **kwargs)
        self.url_params = kwargs.get('url_params').split(',')

    def start_requests(self):
        requests = []
        for url_param in self.url_params:
            requests.append(scrapy.http.FormRequest(
                url='https://m.healthhub.sg/PHApps/SSP/AIC.SSP.ECare/Pages/CareProviderDetails.aspx?{}'.format(url_param),
                callback=self.parse,
                method='POST',
                headers=HEADERS,
                cookies=COOKIES,
                formdata=FORM_DATA,
            ))
        return requests

    def parse(self, response):
        def replace_newlines(s):
            return s.replace('\r', ', ').replace('\n', ', ')

        soup = bs4.BeautifulSoup(response.body, 'html.parser')

        # Get provider name
        name = html.unescape(soup.h2.contents[0].strip())

        # Initialise address, phone_number, and operating_hours because
        # information is not complete in Silver Pages
        address = phone_number = operating_hours = EMPTY_FIELD_DELIMITER

        # Get provider address and operating hours
        provider_info_list = soup.find_all('span', 'txt')
        for provider_info in provider_info_list:
            # Remove all HTML elements
            provider_info_strings = [
                i for i in provider_info.contents if isinstance(i, str)]
            # Stringify the list
            cleaned_provider_info = ''.join(provider_info_strings).strip()
            # Get provider address
            if 'Singapore' in cleaned_provider_info:
                address = replace_newlines(cleaned_provider_info)
            # Get provider operating hours
            elif 'Operating hours' in cleaned_provider_info:
                operating_hours = replace_newlines(cleaned_provider_info)

        # Get provider phone number
        phone_number_neighbor_tag = soup.find('span', 'fa-phone')
        if phone_number_neighbor_tag:
            phone_number_tag = phone_number_neighbor_tag.next_element
            phone_number = phone_number_tag.contents[0]

        with open(PROVIDER_OUTPUT_FILE_NAME, 'a') as provider_output_file:
            provider_output_file.write('{}\t{}\t{}\t{}\n'.format(
                name, address, phone_number, operating_hours))
