#include "utils.hpp"

float toRads(const float &theAngleInDegrees) { return theAngleInDegrees * TO_RADS; }

void perspectiveGL( GLdouble fovY, GLdouble aspect, GLdouble zNear, GLdouble zFar )
{
    GLdouble fW, fH;
    fH = tan( fovY / 360 * pi ) * zNear;
    fW = fH * aspect;
    glFrustum( -fW, fW, -fH, fH, zNear, zFar );
}

Utils::Utils()
{

}

Utils::~Utils()
{

}

SDL_Cursor * cursorFromXPM(const char * xpm[])
{
    int i, row, col;
    int width, height;
    Uint8 * data;
    Uint8 * mask;
    int hot_x, hot_y;
    SDL_Cursor * cursor = NULL;
    sscanf(xpm[0], "%d %d", &width, &height);
    data = (Uint8*)calloc(width/8*height,sizeof(Uint8));
    mask = (Uint8*)calloc(width/8*height,sizeof(Uint8));
    i = -1;
    for ( row=0; row<height; ++row )
    {
        for ( col=0; col<width; ++col )
        {
            if ( col % 8 )
            {
                data[i] <<= 1;
                mask[i] <<= 1;
            }
            else
            {
                ++i;
                data[i] = mask[i] = 0;
            }
            switch (xpm[4+row][col])
            {
                case 'X':
                data[i] |= 0x01;
                mask[i] |= 0x01;
                break;
                case '.':
                mask[i] |= 0x01;
                break;
                case ' ':
                break;
            }
        }
    }
    sscanf(xpm[4+row], "%d,%d", &hot_x, &hot_y);
    cursor = SDL_CreateCursor(data, mask, width, height, hot_x, hot_y);
    free(data);
    free(mask);
    return cursor;
}


bool LoadOBJ(
    const char * path,
    std::vector < glm::vec3 > & out_vertices,
    std::vector < glm::vec2 > & out_uvs,
    std::vector < glm::vec3 > & out_normals
) {
    std::vector< unsigned int > vertexIndices, uvIndices, normalIndices;
    std::vector< glm::vec3 > temp_vertices;
    std::vector< glm::vec2 > temp_uvs;
    std::vector< glm::vec3 > temp_normals;

    FILE * file = fopen(path, "r");
    if( file == NULL ){
        printf("Impossible to open the file !\n");
        return false;
    }

    // Read data
    while( 1 ) {
        char lineHeader[512];
        int res = fscanf(file, "%s", lineHeader);
        if (res == EOF) {
            break;
        } else {
            if ( strcmp( lineHeader, "v" ) == 0 ){
                glm::vec3 vertex;
                fscanf(file, "%f %f %f\n", &vertex.x, &vertex.y, &vertex.z );
                temp_vertices.push_back(vertex);
            } else if ( strcmp( lineHeader, "vt" ) == 0 ) {
                glm::vec2 uv;
                fscanf(file, "%f %f\n", &uv.x, &uv.y );
                temp_uvs.push_back(uv);
            } else if ( strcmp( lineHeader, "vn" ) == 0 ){
                glm::vec3 normal;
                fscanf(file, "%f %f %f\n", &normal.x, &normal.y, &normal.z );
                temp_normals.push_back(normal);
            } else if ( strcmp( lineHeader, "f" ) == 0 ){
                std::string vertex1, vertex2, vertex3;
                unsigned int vertexIndex[3], uvIndex[3], normalIndex[3];
                int matches = fscanf(file, "%d/%d/%d %d/%d/%d %d/%d/%d\n", &vertexIndex[0], &uvIndex[0], &normalIndex[0], &vertexIndex[1], &uvIndex[1], &normalIndex[1], &vertexIndex[2], &uvIndex[2], &normalIndex[2] );
                if (matches != 9){
                    printf("File can't be read by our simple parser : ( Try exporting with other options\n");
                    return false;
                }
                vertexIndices.push_back(vertexIndex[0]);
                vertexIndices.push_back(vertexIndex[1]);
                vertexIndices.push_back(vertexIndex[2]);
                uvIndices    .push_back(uvIndex[0]);
                uvIndices    .push_back(uvIndex[1]);
                uvIndices    .push_back(uvIndex[2]);
                normalIndices.push_back(normalIndex[0]);
                normalIndices.push_back(normalIndex[1]);
                normalIndices.push_back(normalIndex[2]);
            }
        }
    }

    // Copy data
    for( unsigned int i=0; i<vertexIndices.size(); i++ ){
        unsigned int vertexIndex = vertexIndices[i];
        glm::vec3 vertex = temp_vertices[ vertexIndex-1 ];
        out_vertices.push_back(vertex);
        unsigned int uvIndex = uvIndices[i];
        glm::vec2 uv = temp_uvs[ uvIndex-1 ];
        out_uvs.push_back(uv);
        unsigned int normalIndex = normalIndices[i];
        glm::vec3 normal = temp_normals[ normalIndex-1 ];
        out_normals.push_back(normal);
    }
}
