using UnityEngine;

public class HarvesterController : MonoBehaviour
{
    public HarvestConfig config;
    public Transform toolMount;          // نقطة تركيب الأداة أمام المركبة

    private float currentSpeed;
    private HarvestToolData currentTool;
    private GameObject toolInstance;

    void Update()
    {
        float forwardInput = Input.GetAxis("Vertical");
        float turnInput = Input.GetAxis("Horizontal");

        float targetSpeed = forwardInput * config.moveSpeed;
        currentSpeed = Mathf.MoveTowards(currentSpeed, targetSpeed,
                                         config.acceleration * Time.deltaTime);

        transform.Rotate(0f, turnInput * config.turnSpeed * Time.deltaTime, 0f);
        transform.position += transform.forward * currentSpeed * Time.deltaTime;
    }

    // تغيير الأداة وتركيب شكلها الجديد
    public void EquipTool(HarvestToolData tool)
    {
        if (toolInstance != null) Destroy(toolInstance);

        currentTool = tool;
        if (tool == null || tool.toolPrefab == null) return;

        toolInstance = Instantiate(tool.toolPrefab, toolMount);
        toolInstance.transform.localPosition = Vector3.zero;
        toolInstance.transform.localRotation = Quaternion.identity;
    }

    public HarvestToolData CurrentTool => currentTool;
}
