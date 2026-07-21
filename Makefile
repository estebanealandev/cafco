DOMAIN ?= cafco.cr
ANSIBLE_DIR := infra/ansible

.PHONY: provision configure deploy rollback backup health

provision:
	DOMAIN=$(DOMAIN) ./scripts/provision-server.sh

configure:
	cd $(ANSIBLE_DIR) && DOMAIN=$(DOMAIN) ansible-playbook playbooks/site.yml

deploy:
	DOMAIN=$(DOMAIN) ./scripts/deploy.sh

rollback:
	DOMAIN=$(DOMAIN) ./scripts/rollback.sh

backup:
	DOMAIN=$(DOMAIN) REMOTE_BACKUP=1 ./scripts/backup.sh

health:
	DOMAIN=$(DOMAIN) ./scripts/healthcheck.sh
