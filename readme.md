# Serieslist

Keep track of series' seen episodes. Very work in progress!

![Screenshot of 
Serieslist](https://raw.githubusercontent.com/JoosepAlviste/serieslist/master/img/serieslist.png)


## Set up

```bash
git clone https://github.com/JoosepAlviste/serieslist.git

cd api
npm install
cd ..
./bin/generate-secret-token.sh
```

Next, [generate a new OMDb API token](https://www.omdbapi.com/apikey.aspx) and 
add it into the [`.env`](.env) file.


## Production

TODO: Instructions here!

Running in production mode with Docker:

```sh
docker-compose up
```
