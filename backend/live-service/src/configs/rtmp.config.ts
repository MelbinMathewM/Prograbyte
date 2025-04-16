export const RTMP_CONFIG = {
    containerName: "nginx-rtmp",
    image: "alfg/nginx-rtmp",
    ports: {
      rtmp: 1935,
      http: 8080,
    },
    mountPath: "/opt/data/hls",
  };
  