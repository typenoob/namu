# Makefile
CC = emcc
CFLAGS = --use-port=sdl3 -s EXIT_RUNTIME=1
SRC_DIR = src/games
DIST_DIR = public

# 自动查找所有 .c 文件
C_FILES = $(wildcard $(SRC_DIR)/*.c)
JS_FILES = $(patsubst $(SRC_DIR)/%.c, $(DIST_DIR)/%.js, $(C_FILES))

.PHONY: all clean

all: $(JS_FILES)

# 模式规则：每个 .c 对应一个 .js
$(DIST_DIR)/%.js: $(SRC_DIR)/%.c
	@echo "Compiling: $< -> $@"
	@$(CC) $< -o $@ $(CFLAGS)

clean:
	rm -rf $(DIST_DIR)