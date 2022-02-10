import axios from "axios";

export const checkDay = async (user) => {
    let res;
    let arr = [];
    for (let i = 1; i <= 7; ++i) {
        try {
            res = (await axios.get(`http://localhost:5000/week?user=${user}&idx=${i}`));
            res = 200;
            arr.push(i);
        }
        catch(e) {
            console.log('err', e.message);
            res = 404;
        }
    }

    return arr;
}