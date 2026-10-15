import { useEffect, useRef } from 'react'

const VIEW = { width: 5036, height: 2673 }
const ANCHOR = { x: 2152.5, y: 704.5 }
const BODY = { x: 1996, y: 521, width: 155, height: 177 }
const TRACK =
  'M2152.5 704.5L2133.5 733L2129 739L2124 745L2117 755L2110 765L2103 775L2096 785L2090 795L2083.5 805L2077.5 815L2071.5 825L2065.5 835L2060.5 845L2054.5 855L2049.5 865L2044.5 875L2039.5 885L2034.5 895L2030 905L2025.5 915L2021.5 925L2016.5 935L2012.5 945L2008.5 955L2004.5 965L2001 975L1997.5 985L1994 995L1990.5 1005L1987 1015L1984 1025L1981 1035L1978 1045L1975 1055L1972 1065L1969.5 1075L1967 1085L1964 1095L1962 1105L1960 1115L1957 1125L1955 1135L1953 1145L1951 1155L1949 1165L1948 1175L1946 1185L1944 1195L1943.8 1205L1941.3 1215L1941.5 1225L1938.5 1235L1935.5 1245L1930 1255L1926.5 1265L1921.5 1275L1917.5 1285L1914 1295L1910 1305L1906.5 1315L1902.5 1325L1899 1335L1896 1345L1892.5 1355L1889 1365L1886 1375L1883 1385L1880 1395L1877 1405L1874 1415L1871 1425L1868.5 1435L1866 1445L1863.5 1455L1861 1465L1858.5 1475L1856 1485L1854 1495L1852 1505L1850 1515L1848 1525L1846 1535L1844 1545L1842 1555L1841 1565L1839 1575L1838 1585L1836 1595L1835 1605L1833 1615L1832 1625L1831 1635L1830 1645L1829 1655L1828 1665L1827 1675L1826 1685L1826 1695L1825 1705L1825 1715L1824 1725L1824 1735L1823 1745L1823 1755L1823 1765L1823 1775L1823 1785L1823 1795L1823 1805L1823 1815L1824 1825L1824 1835L1824 1845L1825 1855L1826 1865L1826 1875L1827 1885L1828 1895L1829 1905L1830 1915L1831 1925L1832 1935L1833 1945L1835 1955L1836 1965L1838 1975L1839 1985L1841 1995L1843 2005L1845 2015L1847 2025L1849 2035L1851 2045L1853 2055L1856 2065L1858 2075L1861 2085L1863 2095L1866 2105L1869 2115L1872 2125L1875 2135L1878 2145L1881.5 2155L1885 2165L1888.5 2175L1892.5 2185L1896 2195L1900 2205L1904 2215L1908.5 2225L1912.5 2235L1916.5 2245L1921.5 2255L1926.5 2265L1931.5 2275L1936 2285L1941.5 2295L1946.5 2305L1952 2315L1957.5 2325L1963.5 2335L1969.5 2345L1976 2355L1982 2365L1989 2375L1996 2385L2003 2395L2010 2405L2017.5 2415L2025.5 2425L2033.5 2435L2041.5 2445L2050.5 2455L2059.5 2465L2068.5 2475L2078 2485L2088 2495L2098 2505L2109 2515L2120.5 2525L2132 2535L2144.5 2545L2157 2555L2170.5 2565L2184.5 2575L2199.5 2585L2215 2595L2231.5 2605L2244 2612'
const GAP = 'M2244 2612C2269.6 2626.8 2297.6 2636.9 2325 2648'
const DURATION = 1500

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2) * 0.35 + t * 0.65

export function PenNib({ play, delay = 0 }: { play: boolean; delay?: number }) {
  const track = useRef<SVGPathElement>(null)
  const gap = useRef<SVGPathElement>(null)
  const pen = useRef<SVGGElement>(null)

  useEffect(() => {
    const trackPath = track.current
    const gapPath = gap.current
    const penGroup = pen.current
    if (!trackPath || !gapPath || !penGroup) return
    const trackLength = trackPath.getTotalLength()
    const gapLength = gapPath.getTotalLength()
    const total = trackLength + gapLength
    gapPath.style.strokeDasharray = `${gapLength} ${gapLength + 1}`

    const place = (distance: number) => {
      const point =
        distance <= trackLength
          ? trackPath.getPointAtLength(distance)
          : gapPath.getPointAtLength(distance - trackLength)
      penGroup.setAttribute('transform', `translate(${point.x - ANCHOR.x} ${point.y - ANCHOR.y})`)
      gapPath.style.strokeDashoffset = `${gapLength - Math.max(0, distance - trackLength)}`
    }

    if (!play) {
      place(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      place(total)
      return
    }

    let frame = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now + delay * 1000
      const t = Math.min(1, Math.max(0, (now - start) / DURATION))
      place(total * ease(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [play, delay])

  return (
    <svg className="frame-pen" viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} aria-hidden="true">
      <path ref={track} d={TRACK} fill="none" stroke="none" />
      <path ref={gap} d={GAP} className="frame-pen-line" />
      <g ref={pen}>
        <image href="/nib.png" x={BODY.x} y={BODY.y} width={BODY.width} height={BODY.height} />
        <circle cx={ANCHOR.x} cy={ANCHOR.y} r={13.25} className="frame-pen-ring" />
      </g>
    </svg>
  )
}
