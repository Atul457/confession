import { envConfig } from "../../configs/envConfig"

const sharePWLTiles = envConfig.isProdMode ? [
    { src: 'https://thetalkplace.com/cover/Background-01.jpg', link: 'cover/Background-01.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-02.jpg', link: 'cover/Background-02.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-03.jpg', link: 'cover/Background-03.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-04.jpg', link: 'cover/Background-04.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-05.jpg', link: 'cover/Background-05.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-06.jpg', link: 'cover/Background-06.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-07.jpg', link: 'cover/Background-07.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-08.jpg', link: 'cover/Background-08.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-09.jpg', link: 'cover/Background-09.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-10.jpg', link: 'cover/Background-10.jpg' }
] : [
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-01.jpg', link: '/cover/Background-01.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-02.jpg', link: '/cover/Background-02.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-03.jpg', link: '/cover/Background-03.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-04.jpg', link: '/cover/Background-04.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-05.jpg', link: '/cover/Background-05.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-06.jpg', link: '/cover/Background-06.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-07.jpg', link: '/cover/Background-07.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-08.jpg', link: '/cover/Background-08.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-09.jpg', link: '/cover/Background-09.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-10.jpg', link: '/cover/Background-10.jpg' }
]

export { sharePWLTiles }