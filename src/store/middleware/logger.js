import func from "./func";

const logger = state => next => action => {
    console.log("simple middleware");
}

export default logger;