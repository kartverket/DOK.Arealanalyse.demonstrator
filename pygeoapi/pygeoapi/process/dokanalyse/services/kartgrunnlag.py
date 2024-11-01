from async_lru import alru_cache
import aiohttp


async def get_kartgrunnlag(geom, epsg):
    kommunenummer = await get_kommunenummer(geom, epsg)
    dataset_ids = await get_dataset_ids(kommunenummer)

    return dataset_ids


async def get_kommunenummer(geom, epsg):
    centroid = geom.Centroid()
    point = centroid.GetPoint(0)

    return await fetch_kommunenummer(point[0], point[1], epsg)


@alru_cache(maxsize=None, ttl=86400*7)
async def get_dataset_ids(kommunenummer):
    response = await fetch_kartgrunnlag(kommunenummer)

    if response is None:
        return []

    contained_items = response.get('containeditems', [])
    datasets = []

    for dataset in contained_items:
        if dataset.get('ConfirmedDok') == 'JA' and dataset.get('dokStatus') == 'Godkjent':
            metadata_url = dataset.get('MetadataUrl')
            splitted = metadata_url.split('/')
            datasets.append(splitted[-1])

    return datasets


async def fetch_kartgrunnlag(kommunenummer):
    try:
        url = f'https://register.geonorge.no/api/det-offentlige-kartgrunnlaget-kommunalt.json?municipality={kommunenummer}'

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                return await response.json()
    except:
        return None


async def fetch_kommunenummer(x, y, epsg):
    try:
        url = f'https://api.kartverket.no/kommuneinfo/v1/punkt?nord={y}&ost={x}&koordsys={epsg}&filtrer=kommunenummer'

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                json = await response.json()

                return json.get('kommunenummer', None)
    except:
        return None
