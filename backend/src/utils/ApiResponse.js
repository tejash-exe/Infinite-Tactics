class ApiResponse {
    constructor(status = 100, message = "", data = null){
        this.status = status;
        this.message = message;
        this.data = data;
    };
};

export { ApiResponse };