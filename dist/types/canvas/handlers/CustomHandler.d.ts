import { Handler } from '.';
declare class CustomHandler {
    handler: Handler;
    constructor(handler: Handler);
    protected initialze(): void;
}
export default CustomHandler;
