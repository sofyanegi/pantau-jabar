interface ProxyDestination {
  destination: string;
  bypassSsl?: boolean;
}

export const proxyDestinations: { [key: string]: ProxyDestination } = {
  cimahi: {
    destination: 'https://smartcity.cimahikota.go.id/video/',
  },
  bandung: {
    destination: 'https://pelindung.bandung.go.id:3443/video/',
    bypassSsl: true,
  },
  'bandung-dishub': {
    destination: 'https://atcs-dishub.bandung.go.id:1990/',
    bypassSsl: true,
  },
  kbb: {
    destination: 'https://cctv.atcs-dishubkbb.id/',
  },
  bandungkab: {
    destination: 'https://cctv.bandungkab.go.id/',
  },
  sumedang: {
    destination: 'https://atcs.sumedangkab.go.id/video/',
  },
  cianjur: {
    destination: 'https://atcs.cianjurkab.go.id:5443/',
    bypassSsl: true,
  },
  tasik: {
    destination: 'https://atcs.tasikmalayakota.go.id/',
  },
  banjar: {
    destination: 'https://atcs.banjarkota.go.id:5443/',
    bypassSsl: true,
  },
  indramayu: {
    destination: 'https://streamer.indramayukab.go.id/',
  },
};

export const getProxiedUrl = (originalUrl: string): string => {
  const sourceKey = Object.keys(proxyDestinations).find((key) => originalUrl.startsWith(proxyDestinations[key].destination));

  if (sourceKey) {
    const destination = proxyDestinations[sourceKey].destination;
    return originalUrl.replace(destination, `/api/proxy/${sourceKey}/`);
  }

  return originalUrl;
};
