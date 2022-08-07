<template>
  <PictureUploader/>
  <PictureShow/>
</template>

<script>
import PictureShow from "../components/PictureShow";
import PictureUploader from "../components/PictureUploader";
export default {
  name: "PictureManager",
  components: {PictureShow, PictureUploader}
}
</script>
