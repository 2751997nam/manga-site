import DB from '@/lib/db';

const post = async (request, response) => {
    if (request.method == "POST") {
        let params = request.body;
        const forwarded = request.headers["x-forwarded-for"];
        const ip = forwarded ? forwarded.split(/, /)[0] : request.connection.remoteAddress
        const db = DB();
        const device = params.device;
        const browser = params.browser;
        const url = params.url;
        const referrer = params.referrer;
        const userAgent = params.user_agent;
        
        await db.from('tracking').insert({
            url: url,
            referrer: referrer,
            ip: ip,
            device: device,
            browser: browser,
            user_agent: userAgent,
        });

    
        return response.json({
            status: 'successful',
            result: params
        })
    }
}

export default post;;