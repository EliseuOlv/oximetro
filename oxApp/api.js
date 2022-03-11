import axios from "axios";

const base = axios.create({
    baseURL: "http://localhost:4002",
});

export default base;