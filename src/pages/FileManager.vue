<template>
 <FileUploader/>
 <FileShow/>
</template>

<script>
import FileUploader from "../components/FileUploader";
import FileShow from "../components/FileShow";
export default {
  name: "FileManager",
  components: {FileShow, FileUploader}
}
</script>

