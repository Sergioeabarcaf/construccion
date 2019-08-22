from google.cloud import storage
import sys

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    print(blob.upload_from_filename(source_file_name))
    print('File {} uploaded to {}.'.format(
        source_file_name,
        destination_blob_name))

upload_blob(sys.argv[1], sys.argv[2], sys.argv[3])
