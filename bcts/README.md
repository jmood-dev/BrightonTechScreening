# Brighton Collectibles Tech Screening

This is the Brighton Engineering Technical Challenge for Jonathan Mood.

## Installation

In a directory of your choice, run

```bash
git clone https://github.com/jmood-dev/BrightonTechScreening.git
```

## To Run with Docker

```bash
cd BrightonTechScreening/bcts
docker compose build
docker compose up
```

## View Results

When running, the terminal will display the alphabetized state count. 

Running the container will create the `output` folder and the `stores.html` file within that folder. Open `stores.html` in a browser to view the results.

## Kubernetes

### Prerequisite 

Build an image and push it to a registry.

The following is an _example_ of how to do this with a local registry, but you can use a different registry (be sure to adjust the image tag's host and port as needed).

In `BrightonTechScreening/bcts`, run

```bash
docker run -d -p 6000:6000 --restart=always --name registry registry:2
docker build . -t localhost:6000/bcts
docker push localhost:6000/bcts
```

### Validate

In `BrightonTechScreening/k8s`, run

```bash
kubectl apply --dry-run=client -f bcts.yaml
```

## Known Limitations

If `stores.html` is deleted after it is created, running the program results in an error.

`bcts-config.yaml` contains the feed URL in the configmap, but this value  is not actually used for anything.

## Database Normalization

Database structure DBML and diagrams are contained in `DatabaseNormalization.xlsx`

There is some ambiguity about what certain fields returned by the data feed are intended to represent. This should generally be resolved by asking for clarification from the owner of the data. I have prepared several possible structures based on different possibilities, as explained below.

### Option A

This option corresponds to the following fields being dependent only on the store, despite some duplicate values among these fields: 

- name
- name2
- facebookUrl
- phone
- email
- mainImageUrl
- alternateImageUrl2

### Option B

This option corresponds to the following fields being dependent only on the store, despite some duplicate values among these fields: 

- name
- name2
- phone
- email

It presumes these fields have implicit transitive dependencies, such that an update to a single field may require updates to fields for multiple stores in order to maintain consistency:

- facebookUrl
- mainImageUrl

It presumes that `alternateImageUrl2` is a fallback URL for all stores that will be maintained in the constants table.

### Option C

This option corresponds to the following fields being dependent only on the store, despite some duplicate values among these fields: 

- name
- name2

It presumes these fields have implicit transitive dependencies, such that an update to a single field may require updates to fields for multiple stores in order to maintain consistency:

- phone
- email
- facebookUrl
- mainImageUrl

It presumes that `alternateImageUrl2` is a fallback URL for all stores that will be maintained in the constants table.

### Option D

This option corresponds to the following fields having implicit transitive dependencies, such that an update to a single field may require updates to fields for multiple stores in order to maintain consistency:

- name
- name2
- phone
- email
- facebookUrl
- mainImageUrl

It presumes that `alternateImageUrl2` is a fallback URL for all stores that will be maintained in the constants table.

### Option E

This option corresponds to the following fields having implicit transitive dependencies, such that an update to a single field may require updates to fields for multiple stores in order to maintain consistency:

- name
- facebookUrl
- mainImageUrl

It presumes that `name2` is a location name and is dependent on the location.

It presumes that `phone` is the phone number for the physical store and is dependent on the location.

It presumes that `email` is the email for the store's contact and is dependent on the contact.

It presumes that `alternateImageUrl2` is a fallback URL for all stores that will be maintained in the constants table.