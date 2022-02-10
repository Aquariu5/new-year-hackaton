import { Base } from "../components/pages/Base"
import { Attention } from "../components/pages/Attention"
import { Help } from "../components/pages/Help"
import { About } from "../components/pages/About"
import { Contacts } from "../components/pages/Contacts"
import { Countries } from "../components/pages/Countries"
import { Music } from "../components/pages/Music"
export  const routes = [
    {path: '/base', exact: true, component: Base},
    {path: '/attention', exact: true, component: Attention},
    {path: '/help', exact: true, component: Help},
    {path: '/about', exact: true, component: About},
    {path: '/contacts', exact: true, component: Contacts},
    {path: '/countries', exact: true, component: Countries},
    {path: '/music', exact: true, component: Music},
]