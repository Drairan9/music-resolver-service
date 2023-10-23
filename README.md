Music Resolver Service for NoraMusic2[^1]
======
AIO Music resolving service used to request music data *with/without* audio stream from **[Youtube, Spotify, Soundcloud]** using <a href="https://github.com/play-dl/play-dl"><code>play-dl</code></a>.<br />
> *play-dl have much better preformance over youtube-dl or ytdl-core* </br>

This service is mainly build for NoraMusic2 but will be good choice for apps that need to quickly request song data or audio streams.

Endpoints
======
**<code>GET</code>**
/api/v1/search </br> </br>
**Description** </br>
Endpoint will response with array of Tracks  </br> 
Youtube and Soundcloud will be raw, but Spotify song will be searched on youtube using title with artists</br> </br>
**Query String Params**
| FIELD      | TYPE     | DESCRIPTION      |
| :------------- |:--------------| :-----------|
| search_query         | String            | Percent-Encoded URL or Text search query |
> **Note**: search_query param is mandatory

**Responses** </br></br>
```200 OK ```
```typescript
{
    name: string; // Title of the song (with artists)
    url: string | null; // Youtube or Soundcloud url
    thumbnail: string | null; // Thumbnail image url
    search_type: "search" | "url"; // Search type for the resolver service to determine how to get a audio stream
}
```
```400 Bad Request```
```typescipt
{ message: "Missing 'search_query' Parameter" }
```
> **DESC**: No ?search_query= param in the URL

```500 Internal Server Error```
```typescipt
{ message: 'Unexpected track provider.' }
```
> **DESC**: This error code is included for safety purposes and is not expected to be returned under normal circumstances. It serves as a safeguard to handle exceptional situations.

```typescipt
{ message: "Service wasn't able to extract track info" }
```
> **DESC**: No ?search_query= param in the URL


[^1]: Under dev
