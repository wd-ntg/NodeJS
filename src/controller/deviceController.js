import { createNewDeviceService } from "../service/deviceService";
const createNewDevice= async(req, res) => {
    
    createNewDeviceService(req, res);
}
const deviceController = {
    createNewDevice: createNewDevice
}

export default deviceController