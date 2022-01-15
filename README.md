# Chat app wireframe

## Notes before you start
This app is functional but not complete: there are missing feature and the code style is far from perfect. 

We chose to use Python and React because these are part of our stack, but you can use anything you want.

This is mostly an example to help you getting started with docker and not spend too much time setting up
the base project. 

Feel free to use this as baseline for your project, as a reference or discard it completely.


## Getting Started

### Prerequisites

- Make sure to have [docker](https://docs.docker.com/get-docker/) installed beforehand

### Running app

```shell
docker-compose up

# or run in daemon mode

docker-compose up -d
```

The first run will also build the containers.

The API should be available at `http://localhost:5000`

The UI should be available at `http://localhost:3000`

The code in API and UI is mounted directly inside the container and the apps are running with auto reloading,
meaning you do not need to rebuild the containers if you just modify the code.

If you add libraries to the UI or to the API, you need to rebuild the containers to install them.
This is quite obvious for the API (being a python project) but not for the UI, considering 
the `node_modules` is created inside the container in the same directory where the source code is 
but it is not shared with mounted directory on the host machine. 

### Note about UI

In the UI project there are 2 routes `/login` and `/chat` with prebuilt forms. 
In the footer there is a `ping/pong` recurring event as 
a check that the communication between the UI and API is working.

### Stopping app
```shell
docker-compose down -v
```
Note: the `-v` is important because of the named volume defined for the UI project.
