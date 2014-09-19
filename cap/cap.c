#include <stdio.h>

#include "opencv/highgui.h"
#include "opencv/cv.h"
#include "quirc.h"
#include "zmq.h"

int main(void)
{
  void *zmq = zmq_ctx_new();
  void *sock = zmq_socket(zmq, ZMQ_PUB);
  zmq_bind(sock, "tcp://127.0.0.1:8283");
  struct quirc *q = quirc_new();
  CvCapture *cap = cvCreateCameraCapture(0);
  IplImage *grey = NULL;
  while (1) {
    IplImage *image = cvQueryFrame(cap);
    quirc_resize(q, image->width, image->height);
    uint8_t *qimg = quirc_begin(q, NULL, NULL);
    if (!grey) {
      grey = cvCreateImageHeader(cvSize(image->width, image->height), 8, 1);
    }
    grey->imageData = qimg;
    grey->imageDataOrigin = qimg;
    cvCvtColor(image, grey, CV_RGB2GRAY);
    quirc_end(q);
    int qn = quirc_count(q);
    if (qn > 0) {
      struct quirc_code code;
      quirc_extract(q, 0, &code);
      struct quirc_data data;
      quirc_decode(&code, &data);
      if (data.payload_len > 0) {
        printf("QR code detected!\n");
        zmq_send(sock, data.payload, data.payload_len, 0);
      }
    }
  }
  cvReleaseCapture(&cap);
  quirc_destroy(q);
  zmq_close(sock);
  zmq_ctx_term(zmq);
  return 0;
}
