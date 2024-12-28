FROM ubuntu:20.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    sudo && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Verify Java version
RUN java -version

# Download and install Ant Media Server
WORKDIR /opt
RUN wget -O install_ant-media-server.sh https://raw.githubusercontent.com/ant-media/Scripts/master/install_ant-media-server.sh && \
    chmod 755 install_ant-media-server.sh && \
    ./install_ant-media-server.sh

# Expose necessary ports
EXPOSE 5080 1935 5443 8081

# Start Ant Media Server
CMD ["/usr/local/antmedia/start.sh"]