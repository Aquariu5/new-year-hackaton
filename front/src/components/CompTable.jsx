import { FormControl,Form,Button, Table, Card} from "react-bootstrap";
import cl from '../styles/Test.module.css'
export const CompTable = ({title, load, body}) => {
    return (
        <Table className={cl.Table} striped bordered hover variant="dark">
            <thead className="mt-2">
                {title}
            </thead>
            <tbody>
                {
                    body.map(user => <tr key={user}><td onClick={() => load(user)}>{user}</td></tr>)
                }
            </tbody>
        </Table>
    );
}


