import { useState } from "react";
import { FormControl,Form,Button, Table, Card, Container, Image, Pagination, Carousel, Spinner, InputGroup} from "react-bootstrap";
import axios from "axios";
import {CompTable} from './CompTable';
import cl from '../styles/Test.module.css';
import { useEffect } from "react";
import { checkDay } from "../utils/checkDay";

export const Test = () => {
    const [test, setTest] = useState('');
    const [path, setPath] = useState('C:/Aydar/scripts/profiles');
    const [users, setUsers] = useState([]);
    const [pageUsers, setPageUsers] = useState([]);
    const [image, setImage] = useState('');
    const [active, setActive] = useState(1);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chosen, setChosen] = useState(false);
    const [index, setIndex] = useState(0);
    const [index2, setIndex2] = useState(0);
    const [days, setDays] = useState([1,2,3,4,5,6,7]);
    const step = 70;
    const [styleImg, setStyleImg] = useState({width: '45vw', height: '40vh'})

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const handleSelect2 = (selectedIndex, e) => {
        setIndex2(selectedIndex);
    };

    const [currUser, setCurrUser] = useState('')
    useEffect( async () => {

        //let res = (await axios.get('http://localhost:5000/image?name=1')).data;
        //setImage('http://localhost:5000/image?name=1');
        //console.log('res', res);
    },[]);
    //console.log('pages', pages);
    //console.log('active', active);
    const exec = async () => {
        let res = (await axios.get('http://localhost:5000/dir?path=' + path)).data;
        //console.log('res', res);

        setUsers(res);
        setPages(() => {
            
            let obj = [];
            let k = 1;
            for (let i = 0; i < res.length; i += step) {
                let end = i + step;
                if (end > res.length)
                    end = res.length;
                obj.push({num: k, body: res.slice(i, end)})
                ++k;
            }
            return obj;
        });
        setActive(1);

    }

    useEffect(() => {
        //console.log('activenow', active)
        if (pages.length > 0) {
            setPageUsers(pages[active - 1].body);
            //console.log('bodyour', pages[active - 1].body);
        }

    }, [active, pages.length])
    useEffect(() => {
        //console.log('pages', pages);
    }, [pages.length])

    const load = async (user) => {
        console.log('user', user);
        setCurrUser('');
        setDays(7);
        setChosen(true);
        setLoading(true)
        //const pythonProcess = spawn('python',["../../scripts/graphics.py", '/home/operator3/Документы/hack-huyak/scripts', user]);
        //const pythonProcess = spawn('python3',["/home/operator3/Документы/hack-huyak/scripts/test.py"]);
        const len = path.split('/').length;
        const dir = path.split('/')[len - 1];
        let res = (await axios.get(`http://localhost:5000/scr?user=${user}&dir=${dir}`)).data;
        console.log('result', res);
        if (res == 'success') {
            console.log('success')
            setCurrUser(user);
            let arr = await checkDay(user);
            setDays(arr);
        }
        setLoading(false);
    }

    const search = () => {

    }
    return (
        <div>
            <Image style={{position: 'absolute', zIndex: -1, height: '100vh', width: '100vw'}} src={'http://localhost:5000/image?name=5.jpg'} fluid />
            <Image className={cl.Star} src={'http://localhost:5000/image?name=star.png'} fluid />
            <Image style={{position: 'absolute', left: '44vw', top: '20vh', zIndex: 0, width: '100px'}} src={'http://localhost:5000/image?name=era.png'} fluid />
            <Card className={cl.Header}>
                Снежный Код да Винтик
            </Card>
            {/* <Image style={{position: 'absolute', zIndex: -1}} src={'http://localhost:5000/image?name=2'} fluid />
            <Image style={{position: 'absolute', zIndex: -1}} src={image} fluid /> */}
            <Card border="secondary" className={cl.Path} >
                <Form>
                    <Form.Label  className="m-2" style={{fontFamily: 'cursive'}}>
                        Путь до пользователей
                    </Form.Label>
                    <Form.Control
                    
                        value = {path}
                        placeholder="Путь к папке..."
                        onChange={e => setPath(e.target.value)}
                        style={{background: 'rgba(255, 255, 255, 0.5)', fontFamily: 'cursive'}}
                    />
                </Form>

                
                
            </Card>
            <Button style={{margin: '20px', marginTop: '0px'}} onClick={exec}>Загрузить пользователей</Button>
            {/* <FormControl type="file" onChange={(e) => console.log(e.target.files)}/> */}
            <div style={{display: 'flex'}} className={cl.Test}>
                {
                    pageUsers.length ?

                <div>
                    <Card border="primary"  style={{width: '48vw', margin: '20px', background: 'rgba(255, 255, 255, 0.5)', maxHeight: '50vh'}}>
                    
                    <Card.Body>
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            <Card.Subtitle style={{textAlign: 'center', fontSize: '20px', fontFamily: 'Lucida Console, Courier, monospace'}} className="mt-2 ">
                                Список пользователей
                            </Card.Subtitle>
                            <InputGroup className="mb-3" style={{width: '20vw'}}>
                                <FormControl
                                placeholder="Поиск..."
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                />
                                <InputGroup.Text onClick={search} className={cl.Search} id="basic-addon2">🔎</InputGroup.Text>
                            </InputGroup>
                        </div>
                            <CompTable
                                title=""
                                body={pageUsers}
                                load={load}
                            />

                        {
                            pages.length ?
                            <Pagination>
                            {
                                pages.length > step ?
                                (
                                    <Pagination>
                                        <Pagination.Item style={{outline: 'none'}} onClick={() => setActive(1)}>{1}</Pagination.Item>
                                        <Pagination.Item onClick={() => setActive(2)}>{2}</Pagination.Item>
                                        <Pagination.Item onClick={() => setActive(3)}>{3}</Pagination.Item>
                                        <Pagination.Ellipsis/>
                                        <Pagination.Item onClick={() => setActive(pages.length - 2)}>{pages.length - 2}</Pagination.Item>
                                        <Pagination.Item onClick={() => setActive(pages.length - 1)}>{pages.length - 1}</Pagination.Item>
                                    </Pagination>
                                    
                                )

                                :
                                pages.map(page => <Pagination.Item onClick={() => setActive(page.num)}>{page.num}</Pagination.Item>)

                            }
                            </Pagination>
                            :
                            <div>
                            </div>
                        }


                    </Card.Body>
                    

                </Card>
                    {
                        days.length < 5 && currUser ?
                        <Card className={cl.Bad}>
                            <Card.Body>
                                Пользователь является подозрительным!
                            </Card.Body>
                        </Card>
                        :
                        <div></div>
                    }

                </div>
                
                    :
                    <div></div>
                }
                {
                    chosen ?
                    <Card border="primary" style={{width: '45vw',  justifyContent: 'center', alignItems: 'center', margin: '20px', background: 'rgba(255, 255, 255, 0.5)', marginTop: '-10vh'}}>
                    {
                        loading ?
                        <Spinner style={{textAlign: 'center'}} animation="border" />
                        :
                        (
                        <div>
                            <Carousel variant="dark" activeIndex={index} onSelect={handleSelect} style={{marginBottom: '10px'}}>
                                <Carousel.Item>
                                    <Image src={`http://localhost:5000/graph1?user=${currUser}`} style={styleImg}/>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <Image src={`http://localhost:5000/graph2?user=${currUser}`} style={styleImg}/> 
                                </Carousel.Item>
                                <Carousel.Item>
                                    <Image src={`http://localhost:5000/graph3?user=${currUser}`} style={styleImg}/> 
                                </Carousel.Item>
                            </Carousel>

                            <Carousel variant="dark" activeIndex={index2} onSelect={handleSelect2}>
                                {
                                    days.map(el => <Carousel.Item>
                                        <Image src={`http://localhost:5000/week?user=${currUser}&idx=${el}`} style={styleImg}/>
                                    </Carousel.Item>)
                                }
                            </Carousel>
                        </div>                       
                        
                        )
                    }
                    </Card>
                    :
                    <div></div>
                }
               
            </div>


        </div>
    )
}