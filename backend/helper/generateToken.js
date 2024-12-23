import jwt from 'jsonwebtoken';

export function generateToken(id) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
    return token;
}
