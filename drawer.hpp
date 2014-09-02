#pragma once
#include "utils.hpp"

class Shader;
class Model;

class Drawer
{
    private:
        Shader *shader;
        Model *model;

    public:
        Drawer();
        ~Drawer();

        void SetupShaders(void);
        void Draw(void);
};
