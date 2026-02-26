/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    headers: async () => {
        return [
            {
                source: '/nbtv.m3u',
                headers: [
                    { key: 'Content-Type', value: 'text/plain' }
                ]
            }
        ]
    },
};

export default nextConfig;
