<script lang="ts">
    import { onMount } from 'svelte';
    import * as swaggerJson from './api.json';//native json import of sveltekit, directly assigns to an object
    import SwaggerUI from 'swagger-ui';
    import 'swagger-ui/dist/swagger-ui.css';
   
    onMount(async () => {
     SwaggerUI({
      spec: swaggerJson,
      dom_id: '#swagger-ui-container',
      defaultModelsExpandDepth : -1 //hides the schemas of api.json, as these are not needed to be shown publicly
     });
    });
   </script>
   
   <svelte:head>
    <title>API Documentation</title>
   </svelte:head>
   
   <div id="swagger-ui-container" />