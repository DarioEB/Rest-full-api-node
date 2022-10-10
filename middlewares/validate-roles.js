import { request, response } from 'express';


const validateAdminRole = (req = request, res = response, next) => {

    if(!req.user) {
        return res.status(500).json({
            msg: 'Internal server error - User not validated'
        });
    }

    const { role, name } = req.user; 

    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `Usuario ${name} does not have permissions`
        });
    }

    next();
}

const allowedRole = ( ...roles ) => {

    return (req = request, res = response , next) => {
        if(!req.user) {
            return res.status(500).json({
                msg: 'Internal server error - User not validated'
            });
        }

        if(!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `Unauthorized - permission denied ${roles}`
            })
        }

        next();
    }
}

export {
    allowedRole,
    validateAdminRole
}