import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            
            return noData(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

    
}

function noData(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    return res.status(404).json({ message: 'Not Found xD' })

}
