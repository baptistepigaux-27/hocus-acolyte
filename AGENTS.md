# Acolyte runtime notes

The deployable application is the static webapp under `webapp/`. It is served
by the dependency-free `server.py`; `run.sh` is the local entry point.

Keep the canonical Explore corpus in `webapp/explore/data/`. Do not add a
database or copy customer data into this repository. The sandbox runtime must
use `APP_ENV=sandbox` and remains separate from staging and production.

Before a release, run:

```bash
bash deploy/smoke-sandbox.sh
bash webapp/tests/smoke.sh
```

The sandbox deployment uses `deploy/deploy-sandbox.sh <git-ref>` and the
release tree `/srv/acolyte-sandbox/releases`.
