import subprocess


PROVIDER_INPUT_FILE_NAME = 'provider_input.txt'
CDID_PREFIX = 'CDID'
SPID_PREFIX = 'SPID'


def scrape_provider(provider_entry, url_params):
    if provider_entry.startswith(CDID_PREFIX):
        cdid_url_param = provider_entry.split('&')[0]
        url_params.append(cdid_url_param)
    elif provider_entry.startswith(SPID_PREFIX):
        spid_url_param = provider_entry.split('"')[0]
        url_params.append(spid_url_param)


def main():
    # Collect URL parameters for provider sites
    url_params = []
    with open(PROVIDER_INPUT_FILE_NAME) as provider_input_file:
        for provider_entry in provider_input_file:
            scrape_provider(provider_entry, url_params)

    # Run Scrapy to get the relevant data
    url_params_string = ','.join(url_params)
    subprocess.run([
        'pipenv',
        'run',
        'scrapy',
        'crawl',
        'providers',
        '-a',
        'url_params={}'.format(url_params_string),
    ])


if __name__ == '__main__':
    main()
