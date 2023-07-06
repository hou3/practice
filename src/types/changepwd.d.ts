declare namespace Vm{  
    interface changePwd {
        oldPwd: string;
        newPwd: string;
        newPwdConfirm: string;
    }
}

declare namespace HttpPayload {
    interface changePwd {
        oldPwd: string;
        newPwd: string;
        newPwdConfirm: string;
    }
}